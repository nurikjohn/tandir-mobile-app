import React, { useEffect, useState } from "react"

import { useNavigation } from "@react-navigation/native"
import {
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native"
import { IconButton, Text } from "react-native-paper"

import useAddFriendMutation from "../../hooks/mutations/add-friend"

import Button from "../../components/kit/button"
import CouponInput from "../../components/kit/coupon-input"
import MaterialSymbols from "../../components/kit/material-symbols"
import LoadingOverlay from "../../components/shared/loading-overlay"
import ScreenHeader from "../../components/shared/screen-header"
import { convertSecondsToTime } from "../../utils/utils"

import useStyles from "./styles"

function AddFriend(): JSX.Element {
  const { goBack } = useNavigation()
  const { styles, theme } = useStyles()

  const [code, setCode] = useState("")
  const [error, setError] = useState<string>()
  const { mutateAsync, isLoading, reset } = useAddFriendMutation()

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
    })
      .then(goBack)
      .catch((err) => {
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView scrollEnabled={false} contentContainerStyle={styles.main}>
        <ScreenHeader title={"Kupon kodini kiriting"} showDivider={false} />

        <View style={styles.body}>
          <View
            style={{
              alignItems: "center",
              gap: 16,
            }}>
            <CouponInput
              value={code}
              onChangeText={(val) => setCode(val.toUpperCase())}
              error={error}
            />
          </View>
          <View style={styles.hint}>
            <Text variant="labelMedium">Do'stingizdan kupon so'rang</Text>
          </View>
        </View>

        <View style={styles.footer}>
          {Platform.OS != "ios" ? (
            <IconButton
              onPress={goBack}
              icon={"arrow_back"}
              style={styles.back}
            />
          ) : null}
          <View
            style={{
              flex: 1,
            }}>
            <Button onPress={onSubmit} disabled={code.length < 6 || isLoading}>
              Qo'shish
            </Button>
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} />
    </SafeAreaView>
  )
}

export default AddFriend
