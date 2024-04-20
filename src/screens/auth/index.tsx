import React from "react"

import { appleAuth } from "@invertase/react-native-apple-authentication"
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin"
import { Alert, Platform, SafeAreaView, View } from "react-native"
import FastImage from "react-native-fast-image"
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback"
import { Text } from "react-native-paper"

import useAppleAuthMutation from "../../hooks/mutations/auth-apple"
import useGoogleAuthMutation from "../../hooks/mutations/auth-google"

import Button from "../../components/kit/button"
import AppleIcon from "../../components/kit/logo-apple"
import GoogleIcon from "../../components/kit/logo-google"
import LottiAnimation from "../../components/kit/lottie-animation"
import LoadingOverlay from "../../components/shared/loading-overlay"

import useStyles from "./styles"

const thunderAnimation = require("../../assets/animations/thunder.json")

const GOOGLE_CLIENT_ID =
  "724815399248-mi8dfd7629p7t6bfg7ft2ec4kqpsl1an.apps.googleusercontent.com"

const GOOGLE_CLIENT_ID_IOS =
  "724815399248-ivacd03md2r7eie08acqs76lf80dbh0c.apps.googleusercontent.com"

GoogleSignin.configure({
  iosClientId: GOOGLE_CLIENT_ID_IOS,
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: false,
})

const sleep = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })

function Auth(): JSX.Element {
  const { styles } = useStyles()
  const googleAuthMutation = useGoogleAuthMutation()
  const appleAuthMutation = useAppleAuthMutation()

  const vibrate = async () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    }

    await sleep(1200)
    HapticFeedback.trigger(HapticFeedbackTypes.notificationError, options)

    await sleep(200)
    HapticFeedback.trigger(HapticFeedbackTypes.impactLight, options)

    await sleep(100)
    HapticFeedback.trigger(HapticFeedbackTypes.impactMedium, options)

    await sleep(200)
    HapticFeedback.trigger(HapticFeedbackTypes.impactLight, options)

    await sleep(300)
    HapticFeedback.trigger(HapticFeedbackTypes.impactHeavy, options)

    await sleep(200)
    HapticFeedback.trigger(HapticFeedbackTypes.impactLight, options)

    await sleep(100)
    HapticFeedback.trigger(HapticFeedbackTypes.impactMedium, options)

    await sleep(300)
    HapticFeedback.trigger(HapticFeedbackTypes.impactLight, options)
  }

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()

      if (userInfo.idToken) {
        googleAuthMutation.mutateAsync(userInfo.idToken).catch((error) => {})
      }
    } catch (error) {
      // @ts-expect-error
      if (error.code) {
        // @ts-expect-error
        if (error.code != statusCodes.SIGN_IN_CANCELLED) {
          // @ts-expect-error
          Alert.alert("Xatolik yuz berdi", error?.message)
        }
      } else {
        // @ts-expect-error
        Alert.alert("Xatolik yuz berdi", error?.message)
      }
    }
  }

  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      )

      if (credentialState === appleAuth.State.AUTHORIZED) {
        await appleAuthMutation.mutateAsync({
          id_token: appleAuthRequestResponse.identityToken as string,
          first_name:
            (appleAuthRequestResponse.fullName?.givenName as string) ||
            undefined,
          last_name:
            (appleAuthRequestResponse.fullName?.familyName as string) ||
            undefined,
        })
      }
    } catch (error) {
      // @ts-expect-error
      if (error.code) {
        // @ts-expect-error
        if (error.code != appleAuth.Error.CANCELED) {
          // @ts-expect-error
          Alert.alert("Xatolik yuz berdi", error?.message)
        }
      } else {
        // @ts-expect-error
        Alert.alert("Xatolik yuz berdi", error?.message)
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.main}>
        <Text style={{}} variant="headlineMedium">
          Xush kelibsiz,{"\n"}Jangchi!
        </Text>

        <View style={styles.body}>
          <View style={styles.animationContainer}>
            <LottiAnimation
              autoPlay
              source={thunderAnimation}
              onPlay={vibrate}
              style={styles.animation}
            />
          </View>

          <FastImage
            style={styles.backgroundImage}
            resizeMode="contain"
            source={require("../../assets/images/grid.png")}
          />
        </View>

        <View style={styles.footer}>
          <Button onPress={signInWithGoogle} left={<GoogleIcon />}>
            Google orqali kirish
          </Button>

          {Platform.OS == "ios" ? (
            <Button onPress={signInWithApple} left={<AppleIcon />}>
              Apple orqali kirish
            </Button>
          ) : null}
        </View>

        <LoadingOverlay
          visible={googleAuthMutation.isLoading || appleAuthMutation.isLoading}
        />
      </View>
    </SafeAreaView>
  )
}

export default Auth
