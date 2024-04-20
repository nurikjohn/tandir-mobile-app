import React from "react"

import { ViewProps } from "react-native"
import {
  TouchableRipple,
  TouchableRippleProps,
  useTheme,
} from "react-native-paper"
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"

type Props = TouchableRippleProps &
  AnimatedProps<ViewProps> & {
    children: React.ReactNode
  }

const Pressable = ({
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  children,
  ...props
}: Props) => {
  const scale = useSharedValue(1)
  const theme = useTheme()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    }
  }, [scale])

  return (
    <TouchableRipple
      onPressIn={(e) => {
        scale.value = withDelay(200, withTiming(0.97, { duration: 200 }))
        onPressIn?.(e)
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: 100 })
        onPressOut?.(e)
      }}
      rippleColor={theme.colors.surfaceVariant}
      delayLongPress={400}
      onLongPress={(e) => {
        onLongPress?.(e)
      }}
      onPress={onPress}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </TouchableRipple>
  )
}

export default Pressable
