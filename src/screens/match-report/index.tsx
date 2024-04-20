import React, { useState } from "react"

import { useNavigation, useRoute } from "@react-navigation/native"
import { Platform, SafeAreaView, ScrollView, View } from "react-native"
import { Text, TextInput, TouchableRipple } from "react-native-paper"
import { useAnimatedKeyboard } from "react-native-reanimated"

import useMatchReportMutation from "../../hooks/mutations/send-report"

import Button from "../../components/kit/button"
import LottieAnimation from "../../components/kit/lottie-animation"
import MaterialSymbols from "../../components/kit/material-symbols"
import EmptyPage from "../../components/shared/empty-page"
import ScreenHeader from "../../components/shared/screen-header"
import { RootRouteProps } from "../../navigation"

import useStyles from "./styles"

const doneAnimation = require("../../assets/animations/done.json")

type RouteProps = RootRouteProps<"match-report">

function MatchReport(): JSX.Element {
  useAnimatedKeyboard()

  const { goBack } = useNavigation()
  const { styles, theme } = useStyles()

  const {
    params: { match_key, challenge_id },
  } = useRoute<RouteProps>()

  const [description, setDescription] = useState("")
  const [type, setType] = useState("")
  const [sent, setSent] = useState(false)
  const { mutateAsync, isLoading } = useMatchReportMutation()

  const onSubmit = () => {
    mutateAsync({
      match_key,
      description,
      issue_type: type,
      challenge: challenge_id,
    }).then(() => {
      setSent(true)
      setTimeout(() => {
        goBack()
      }, 3000)
    })
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScreenHeader
        action={() => goBack()}
        actionIcon={Platform.select({
          ios: "close",
          android: "arrow_back",
        })}
        showDivider={false}
        titleStyle={{
          fontSize: 24,
          lineHeight: 38,
          marginLeft: 8,
        }}
        shift={Platform.select({
          ios: 0,
        })}
        title=""
      />

      {sent ? (
        <EmptyPage
          animation={doneAnimation}
          title="Arizangiz yuborildi"
          description=""
        />
      ) : (
        <ScrollView scrollEnabled={false} contentContainerStyle={styles.main}>
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <TextInput
              multiline
              value={description}
              mode="outlined"
              outlineColor={theme.colors.onSurfaceVariant}
              outlineStyle={{
                borderWidth: 2,
              }}
              onChangeText={(text) => setDescription(text)}
              contentStyle={{
                minHeight: 200,
                maxHeight: 200,
                paddingTop: 16,
              }}
              placeholder="Muammoni batafsil tushuntiring…"
            />
          </View>

          <View style={styles.radioGroup}>
            <TouchableRipple onPress={() => setType("spelling")}>
              <View style={styles.radioItem}>
                <View
                  style={[
                    styles.radio,
                    type == "spelling" ? styles.radioActive : null,
                  ]}>
                  {type == "spelling" ? (
                    <MaterialSymbols
                      color={theme.colors.primary}
                      size={20}
                      name="check"
                      shift={0}
                    />
                  ) : null}
                </View>

                <Text variant="bodyMedium">Imloviy xato</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => setType("wrong_answer")}>
              <View style={styles.radioItem}>
                <View
                  style={[
                    styles.radio,
                    type == "wrong_answer" ? styles.radioActive : null,
                  ]}>
                  {type == "wrong_answer" ? (
                    <MaterialSymbols
                      color={theme.colors.primary}
                      size={20}
                      name="check"
                      shift={0}
                    />
                  ) : null}
                </View>

                <Text variant="bodyMedium">Noto'g'ri javob</Text>
              </View>
            </TouchableRipple>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button
          onPress={onSubmit}
          disabled={!description || !type || isLoading}>
          Yuborish
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default MatchReport
