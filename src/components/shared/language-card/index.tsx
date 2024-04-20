import { memo, useState } from "react"

import Color from "color"
import { GestureResponderEvent, View, ViewStyle } from "react-native"
import FastImage from "react-native-fast-image"
import LinearGradient from "react-native-linear-gradient"
import { Divider, Text, TouchableRipple } from "react-native-paper"
import Animated, { FadeInDown } from "react-native-reanimated"

import { ILanguage } from "../../../types"
import compareProps from "../../../utils/compare-props"

import useStyles from "./styles"

type Props = {
  data: ILanguage
  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined
  onPressInactive?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined

  style?: ViewStyle
  containerStyle?: ViewStyle
  active?: boolean
  row?: number
  disabledInactive?: boolean
  disableAnimation?: boolean
}

const LanguageCard = ({
  onPress,
  style,
  containerStyle,
  data,
  active,
  disabledInactive,
  disableAnimation,
  onPressInactive,
  row = 1,
}: Props) => {
  const inactive = disabledInactive && !data.is_active
  const { styles, theme } = useStyles({
    active,
    inactive,
    progress: data.release_progress,
  })

  const [colors] = useState([
    Color(theme.colors.primary).alpha(0.5).toString(),
    Color(theme.colors.primary).alpha(0.1).toString(),
  ])

  return (
    <Animated.View
      entering={
        row < 5 && !disableAnimation
          ? FadeInDown.delay(200 + row * 100).springify()
          : undefined
      }
      style={[style]}>
      {inactive ? (
        <View
          style={{
            backgroundColor: "#00000008",
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />
      ) : null}
      <TouchableRipple
        rippleColor={theme.colors.primaryContainer}
        onPress={inactive ? onPressInactive : onPress}>
        <View style={[styles.main, containerStyle]}>
          <FastImage
            style={styles.image}
            source={{
              uri: data.icon.replace("https", "http").replace("http", "https"),
              priority: FastImage.priority.high,
            }}
            resizeMode="contain"
          />
          <Text variant="titleMedium" style={styles.label}>
            {inactive ? `${data.release_progress}%` : data.name}
          </Text>
        </View>
      </TouchableRipple>
      {inactive ? (
        <View style={styles.gradientContainer}>
          <Divider style={styles.progressDivider} />
          <LinearGradient
            colors={colors}
            style={styles.gradient}></LinearGradient>
        </View>
      ) : null}
    </Animated.View>
  )
}

export default memo(LanguageCard, compareProps(["active"]))
