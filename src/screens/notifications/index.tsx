import React, { useRef } from "react"

import { useNavigation } from "@react-navigation/native"
import { View } from "react-native"
import { Text } from "react-native-paper"
import { useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BottomSheetMethods } from "../../components/kit/bottom-sheet"
import Button from "../../components/kit/button"
import LogoTelegram from "../../components/kit/logo-telegram"
import SafeAreaView from "../../components/kit/safe-area-view"
import ContactsSheet from "../../components/shared/contacts-sheet"
import NotificationsList from "../../components/shared/notifications-list"
import ScreenHeader from "../../components/shared/screen-header"
import { StackScreenParams } from "../../navigation"
import { INotification } from "../../types"

import useStyles from "./styles"

type ScreenProps = StackScreenParams<"home">

const Notifications = (): JSX.Element => {
  const { navigate } = useNavigation<ScreenProps>()

  const { bottom } = useSafeAreaInsets()
  const { styles, theme } = useStyles()
  const { goBack } = useNavigation()
  const scrollY = useSharedValue(0)
  const contactsRef = useRef<BottomSheetMethods>(null)

  const openNotification = (notification: INotification) => {
    navigate("notification", {
      notification_id: notification.id,
    })
  }

  const openContactsSheet = () => {
    contactsRef.current?.open()
  }

  return (
    <SafeAreaView style={styles.main}>
      <ScreenHeader
        style={{
          alignItems: "center",
        }}
        titleStyle={{
          lineHeight: 40,
        }}
        title={`Xabarlar`}
        actionIcon="arrow_back"
        action={goBack}
        scrollY={scrollY}
      />

      <NotificationsList scrollY={scrollY} onItemPress={openNotification} />

      <View
        style={{
          position: "absolute",
          bottom,
          width: "100%",
          padding: 16,
          borderColor: theme.colors.surface,
          borderTopWidth: 2,
          backgroundColor: theme.colors.background,
        }}>
        <Button onPress={openContactsSheet} left={<LogoTelegram />}>
          Safimizga qo'shiling!
        </Button>
      </View>

      <ContactsSheet ref={contactsRef} />
    </SafeAreaView>
  )
}

export default Notifications
