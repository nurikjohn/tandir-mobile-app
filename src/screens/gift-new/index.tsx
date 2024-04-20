import React, { useCallback } from "react"

import { useNavigation } from "@react-navigation/native"
import { useFont } from "@shopify/react-native-skia"
import { View, useWindowDimensions } from "react-native"
import { Gesture, GestureType } from "react-native-gesture-handler"
import { FAB, Text } from "react-native-paper"
import Animated, { FadeInDown } from "react-native-reanimated"

import useInvitations from "../../hooks/queries/invitations"

import MaterialSymbols from "../../components/kit/material-symbols"
import SafeAreaView from "../../components/kit/safe-area-view"

import { Header } from "./header"
import { Project } from "./project"
import useStyles from "./styles"

const boldTf = require("../../assets/fonts/SpaceMono-Bold.ttf")

const Gift = () => {
  const navigation = useNavigation()
  const { styles, theme } = useStyles()
  const { data: invitations } = useInvitations()

  const panGestureRef = React.useRef<GestureType>(Gesture.Pan())

  const headerFont = useFont(boldTf, 16)
  const titleFont = useFont(boldTf, 36)
  const normalFont = useFont(boldTf, 18)

  const backIcon = useCallback(
    () => (
      <MaterialSymbols
        shift={2}
        name="arrow_back"
        color={theme.colors.onSurface}
      />
    ),
    [theme],
  )

  if (!titleFont || !normalFont || !headerFont) {
    return null
  }

  return (
    <>
      <SafeAreaView edges={["top"]}>
        <Header>
          <View>
            <View style={styles.listHeadeContent}>
              <Text style={styles.listHeaderTitle} variant="titleLarge">
                Tandirni{"\n"}qizdiring 🔥
              </Text>
              <Text style={styles.listHeaderDescription} variant="labelLarge">
                Do'stlaringizni kupon orqali Tandirga taklif qiling!
                Qayg'urmang, kuponlar har hafta berib boriladi, tugab qolmaydi!
              </Text>
            </View>
          </View>
        </Header>
        <View
          style={{
            width: "100%",
            height: "100%",
          }}>
          {invitations?.map((coupon, index) => {
            return (
              <Project
                panGestureRef={panGestureRef}
                last={true}
                key={coupon.code}
                font={titleFont}
                smallFont={normalFont}
                coupon={coupon}
                index={index}
              />
            )
          })}
        </View>
      </SafeAreaView>
      <Animated.View
        style={styles.backContainer}
        entering={FadeInDown.delay(200).springify()}>
        <FAB
          elevation={0}
          icon={backIcon}
          style={styles.back}
          onPress={navigation.goBack}
        />
      </Animated.View>
    </>
  )
}

export default Gift
