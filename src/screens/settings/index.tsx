import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { JS_BUILD_NUMBER } from "@env"
import { useNetInfo } from "@react-native-community/netinfo"
import { useNavigation } from "@react-navigation/native"
import { Alert, ScrollView, TouchableWithoutFeedback, View } from "react-native"
import DeviceInfo from "react-native-device-info"
import RNReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback"
import { Divider, IconButton, List, Text, TextInput } from "react-native-paper"

import useDeleteAccountMutation from "../../hooks/mutations/delete-account"
import useLogOutMutation from "../../hooks/mutations/log-out"
import usePreferencesMutation from "../../hooks/mutations/preferences"
import useProfileMutation from "../../hooks/mutations/profile"
import usePreferences from "../../hooks/queries/preferences"
import useProfile from "../../hooks/queries/profile"
import useStorage from "../../hooks/utils/useStorage"

import { useFriendsContext } from "../../components/context/friends"
import { BottomSheetMethods } from "../../components/kit/bottom-sheet"
import MaterialSymbols from "../../components/kit/material-symbols"
import SafeAreaView from "../../components/kit/safe-area-view"
import LanguageSheet from "../../components/shared/language-sheet"
import LoadingOverlay from "../../components/shared/loading-overlay"
import ScreenHeader from "../../components/shared/screen-header"
import { StackScreenParams } from "../../navigation"
import { ILanguage } from "../../types"

import useStyles from "./styles"

type ScreenProps = StackScreenParams<"home">

const version = {
  version: DeviceInfo.getVersion(),
  build: DeviceInfo.getBuildNumber(),
  jsBuild: JS_BUILD_NUMBER,
}

function Settings(): JSX.Element {
  const { isConnected } = useNetInfo()
  const socket = useFriendsContext()

  const [networkInspectorEnabled, setNetworkInspectorEnabled] =
    useStorage<boolean>("network-inspector-enabled")
  const [longPressCount, setLongPressCount] = useState(0)

  const { styles, theme } = useStyles({ socketConnected: socket.isConnected })
  const { data: profile } = useProfile()
  const { data: preferences } = usePreferences()
  const [first_name, setFirstName] = useState(profile?.first_name)
  const [last_name, setLastName] = useState(profile?.last_name)
  const [checkingUpdate, setCheckingUpdate] = useState(false)
  const preferencesMutation = usePreferencesMutation()
  const profileMutation = useProfileMutation()
  const logOutMutation = useLogOutMutation()
  const deleteAccountMutation = useDeleteAccountMutation()
  const { goBack } = useNavigation()

  // variables
  const languageSelect = useRef<BottomSheetMethods>(null)

  const openLanguageSheet = () => {
    languageSelect?.current?.open()
  }

  const closeLanguageSheet = () => {
    languageSelect?.current?.close()
  }

  const saveLanugage = useCallback((item: ILanguage) => {
    languageSelect?.current?.close()

    preferencesMutation
      .mutateAsync({
        primary_topic: item.id,
      })
      .then(() => {})
      .catch((error) => {})
  }, [])

  const saveChanges = () => {
    profileMutation
      .mutateAsync({
        first_name: first_name?.trim(),
        last_name: last_name?.trim() || null,
      })
      .catch((error) => {})
  }

  const hasChange = useMemo(() => {
    if (first_name != profile?.first_name) return true
    if (last_name != profile?.last_name) return true

    return false
  }, [profile, first_name, last_name])

  const logout = () => {
    Alert.alert(
      "Rostan, seryozni...",
      "\nRostan akkauntdan chiqmoqchimisiz?\n",
      [
        {
          text: "Yo'q",
          style: "cancel",
          isPreferred: true,
        },
        {
          text: "Ha",
          onPress: () => {
            logOutMutation.mutateAsync()
          },
          style: "destructive",
        },
      ],
    )
  }

  const deleteAccount = () => {
    Alert.alert(
      "Akkauntni o’chirish",
      "Akkauntingiz o’chirish uchun 3 kunlik navbatga qo’yiladi va muddat tugagach o’chiriladi. Agar bu vaqt ichida ilovaga qaytib kirsangiz, navbatdan olib tashlanasiz va akkauntingiz o’chirilmaydi",
      [
        {
          text: "Bekor qilish",
          style: "cancel",
          isPreferred: true,
        },
        {
          text: "Tushundim, navbatga qo’yilsin",
          onPress: () => {
            deleteAccountMutation.mutateAsync()
          },
          style: "destructive",
        },
      ],
    )
  }

  useEffect(() => {
    if (longPressCount == 5) {
      Alert.prompt("okay", "what next", (code) => {
        if (code === "69") {
          setNetworkInspectorEnabled(true)
        } else if (code === "42") {
          setNetworkInspectorEnabled(false)
        }
      })
      setLongPressCount(0)
    }
  }, [longPressCount])

  return (
    <SafeAreaView style={styles.main} edges={["top", "bottom"]}>
      <ScreenHeader
        style={{
          alignItems: "center",
        }}
        titleStyle={{
          lineHeight: 40,
        }}
        showDivider={false}
        title={`Sozlamalar`}
        actionIcon="arrow_back"
        action={goBack}>
        <IconButton
          style={styles.saveButton}
          size={16}
          icon={() =>
            hasChange ? (
              <MaterialSymbols
                color={theme.colors.onBackground}
                name="check"
                shift={-2}
              />
            ) : null
          }
          disabled={!hasChange}
          onPress={saveChanges}
        />
      </ScreenHeader>

      <ScrollView scrollEnabled={false} contentContainerStyle={styles.body}>
        <View
          style={{
            flex: 1,
          }}>
          <List.Section title="Profil">
            <TextInput
              style={styles.title}
              value={first_name}
              label={"Ism"}
              underlineStyle={styles.underline}
              underlineColor={theme.colors.surface}
              onChangeText={setFirstName}
              contentStyle={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              disabled={!isConnected}
              maxLength={30}
            />

            <TextInput
              style={styles.title}
              value={last_name}
              label={"Familiya"}
              underlineStyle={styles.underline}
              underlineColor={theme.colors.surface}
              onChangeText={setLastName}
              contentStyle={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              disabled={!isConnected}
              maxLength={30}
            />
          </List.Section>

          <List.Section title="Asosiy dasturlash tili">
            <List.Item
              title={preferences?.primary_topic?.name ?? "-------------"}
              onPress={openLanguageSheet}
              right={({ style, color }) => (
                <View style={style}>
                  <MaterialSymbols name={"expand_more"} color={color} />
                </View>
              )}
              style={styles.listItem}
              titleStyle={styles.listTitle}
              disabled={!isConnected}
            />
            <Divider leftInset style={styles.divider} />
          </List.Section>
        </View>

        <Divider leftInset style={styles.divider} />

        <List.Item
          title="Akkauntni o’chirish"
          onPress={deleteAccount}
          right={({ style }) => (
            <View style={style}>
              <MaterialSymbols name={"delete"} color={theme.colors.error} />
            </View>
          )}
          style={[styles.listItem]}
          disabled={!isConnected}
          titleStyle={[styles.listTitle, styles.logoutTitle]}
        />
        <Divider leftInset style={styles.divider} />
        <List.Item
          title="Chiqish"
          onPress={logout}
          right={({ style }) => (
            <View style={style}>
              <MaterialSymbols name={"logout"} color={theme.colors.error} />
            </View>
          )}
          style={[styles.listItem]}
          disabled={!isConnected}
          titleStyle={[styles.listTitle, styles.logoutTitle]}
        />

        <TouchableWithoutFeedback
          onLongPress={() => {
            setLongPressCount((prev) => prev + 1)
            RNReactNativeHapticFeedback.trigger(HapticFeedbackTypes.selection)
          }}>
          <View style={styles.version}>
            <Text style={styles.versionText} variant="bodyMedium">
              v{version.version} ({version.build}.{version.jsBuild})
            </Text>
            <View style={styles.socketIndicator} />
            {socket.reconnectCount ? (
              <Text style={styles.versionText} variant="bodyMedium">
                ({socket.reconnectCount})
              </Text>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <LanguageSheet
        ref={languageSelect}
        onSelect={saveLanugage}
        selectedItemId={preferences?.primary_topic?.id}
      />

      <LoadingOverlay
        visible={
          preferencesMutation?.isLoading ||
          profileMutation?.isLoading ||
          logOutMutation?.isLoading ||
          deleteAccountMutation.isLoading ||
          checkingUpdate
        }
      />
    </SafeAreaView>
  )
}

export default Settings
