import React, { memo, useEffect, useState } from "react"

import { TextStyle } from "react-native"
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback"
import { Text } from "react-native-paper"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated"

import compareProps from "../../../utils/compare-props"

const IncrementNumber = ({
  style,
  from,
  to,
  origin,
  delay = 1000,
}: {
  style?: TextStyle
  from: number
  to: number
  delay?: number
  origin: "left" | "right"
}) => {
  const [number, setNumber] = useState(from)
  const scale = useSharedValue(1)

  const animate = (mid: any, done: any) => {
    scale.value = withSequence(
      withSpring(1.5, { duration: 200 }),
      withSpring(1, { duration: 200 }, () => {
        runOnJS(done)()
      }),
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const incrementNum = () => {
        HapticFeedback.trigger(HapticFeedbackTypes.selection)

        const sign = from > to ? -1 : 1

        setNumber((prev) => prev + 1 * sign)
      }

      const recur = () => {
        setNumber((prev) => {
          if (prev < to) increment()

          return prev
        })
      }

      const increment = () => {
        incrementNum()
        animate(incrementNum, recur)
      }

      increment()
    }, delay)

    return () => clearTimeout(timer)
  }, [])

  const textStyle = useAnimatedStyle(() => {
    const direction = origin == "left" ? 1 : -1

    return {
      transform: [
        { translateX: direction * 12 },
        {
          scale: scale.value,
        },
        { translateX: direction * -12 },
      ],
    }
  }, [])

  return (
    <Animated.View style={[textStyle]}>
      <Text variant="bodyLarge" numberOfLines={1} style={style}>
        {number}
      </Text>
    </Animated.View>
  )
}

export default memo(IncrementNumber, compareProps(["from", "to"]))
