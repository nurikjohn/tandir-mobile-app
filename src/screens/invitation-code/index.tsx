import React, { useEffect, useState } from "react"

import {
  Alert,
  Keyboard,
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native"
import { IconButton, Text } from "react-native-paper"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import useActivateProfileMutation from "../../hooks/mutations/activate-profile"
import useLogOutMutation from "../../hooks/mutations/log-out"
import useContacts from "../../hooks/queries/contacts"
import useLanguages from "../../hooks/queries/languages"

import Button from "../../components/kit/button"
import CouponInput from "../../components/kit/coupon-input"
import LottieAnimation from "../../components/kit/lottie-animation"
import MaterialSymbols from "../../components/kit/material-symbols"
import LoadingOverlay from "../../components/shared/loading-overlay"
import ScreenHeader from "../../components/shared/screen-header"
import { convertSecondsToTime } from "../../utils/utils"

import useStyles from "./styles"

const thunderAnimation = require("../../assets/animations/hand_down.json")

function InvitationCode(): JSX.Element {
  const { width } = useWindowDimensions()

  // PREFETCH
  useLanguages()
  const logOutMutation = useLogOutMutation()

  const { styles, theme } = useStyles()

  const [code, setCode] = useState("")
  const [error, setError] = useState<string>()
  const handX = useSharedValue(0)
  const { data: contacts } = useContacts()

  const { mutateAsync, isLoading, isError, reset } =
    useActivateProfileMutation()

  useEffect(() => {
    reset()
    setError(undefined)

    if (code.length == 6) {
      Keyboard.dismiss()
    }
  }, [code])

  const onSubmit = () => {
    mutateAsync({
      code,
    }).catch((err) => {
      const error = err?.response?.data

      if (
        error?.error == "too_many_attempts" &&
        typeof error?.wait == "number"
      ) {
        const wait = convertSecondsToTime(error.wait)
        setError(`${wait}dan kegin qayta urinib ko'ring`)
        return
      }

      if (error?.code?.[0] == "Invitation is invalid") {
        setError(`Kupon kodi yaroqli emas`)
        return
      }

      setError("Xatolik yuz berdi, qayta urinib ko'ring")
    })
  }

  const logout = () => {
    logOutMutation.mutateAsync()
  }

  const openTelegramBetaGroup = async () => {
    const BETA_GROUP_URL = contacts?.tg_beta_group_link
    if (!BETA_GROUP_URL) return

    const supported = await Linking.canOpenURL(BETA_GROUP_URL)

    if (supported) {
      await Linking.openURL(BETA_GROUP_URL)
    } else {
      Alert.alert(`Xatolik yuz berdi qayta urunib ko'ring`)
    }
  }

  const animatedHandStyle = useAnimatedStyle(() => {
    let value = "0deg"

    if (handX.value < width / 2 - 50) {
      value = "-45deg"
    } else if (handX.value > width / 2 + 50) {
      value = "45deg"
    }

    return {
      transform: [
        {
          rotate: withTiming(value, { duration: 450 }),
        },
      ],
    }
  }, [handX])

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView scrollEnabled={false} contentContainerStyle={styles.main}>
        <ScreenHeader title={`Kupon kodini\nkiriting`} showDivider={false} />

        <View style={styles.body}>
          <CouponInput
            value={code}
            onChangeText={(val) => setCode(val.toUpperCase())}
            error={error}
          />
          <View style={styles.hint}>
            <View
              style={{
                flexDirection: "column",
                borderWidth: 2,
                borderColor: theme.colors.surface,
                padding: 16,
                borderBottomWidth: 0,
              }}>
              <Text
                variant="bodySmall"
                style={{ lineHeight: 20 }}
                onLayout={() => {}}>
                Tandirga ulanish uchun sizga kupon kerak. Tandirchilardan kupon
                so'rang. Mana bu guruhdan Tandirchilarni topishingiz mumkin
                <Animated.View
                  style={animatedHandStyle}
                  onLayout={({ nativeEvent: { layout } }) => {
                    handX.value = layout.x + 32
                  }}>
                  <LottieAnimation
                    source={thunderAnimation}
                    style={{
                      width: 20,
                      height: 20,
                      marginBottom: -4,
                    }}
                    autoPlay={true}
                    loop={true}
                  />
                </Animated.View>
              </Text>
            </View>
            <Button
              color={theme.colors.surface}
              titleStyle={{
                color: theme.colors.onBackground,
              }}
              onPress={openTelegramBetaGroup}>
              Guruhga qo'shilish
            </Button>
          </View>
        </View>

        <View style={styles.footer}>
          <IconButton
            style={{
              margin: 0,
              borderWidth: 2,
              borderColor: theme.colors.error,
              borderRadius: 0,
              height: 56,
              width: 56,
            }}
            icon={() => (
              <MaterialSymbols
                name={"logout"}
                color={theme.colors.error}
                style={{
                  transform: [
                    {
                      rotate: "180deg",
                    },
                  ],
                }}
                shift={0}
              />
            )}
            iconColor={theme.colors.error}
            onPress={logout}
          />
          <View
            style={{
              flex: 1,
            }}>
            <Button onPress={onSubmit} disabled={code.length < 6 || isLoading}>
              Davom etish
            </Button>
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} />
    </SafeAreaView>
  )
}

export default InvitationCode
