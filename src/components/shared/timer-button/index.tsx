import { useEffect, useState } from "react"

import { Alert, View } from "react-native"
import Animated, {
  Easing,
  ReduceMotion,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import Button, { Props as ButtonProps } from "../../kit/button"

import useStyles from "./styles"

type Props = {
  duration?: number
  initialState?: number
  onComplete?: () => void
} & ButtonProps

const TimerButton = ({
  initialState,
  duration = 60,
  onComplete,
  ...props
}: Props) => {
  const _initialState = initialState ? initialState : duration

  const { styles, theme } = useStyles()
  const offset = useSharedValue(_initialState ? duration - _initialState : 0)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (width) {
      offset.value = withTiming(
        60,
        {
          duration: _initialState * 1000,
          easing: Easing.linear,
          reduceMotion: ReduceMotion.Never,
        },
        (isFinished) => {
          if (isFinished && onComplete) {
            runOnJS(onComplete)()
          }
        },
      )
    }
  }, [width])

  const animatedStyle = useAnimatedStyle(() => {
    const _width = interpolate(offset.value, [0, 60], [width, 0])
    const color = interpolateColor(
      offset.value,
      [40, 45],
      [theme.colors.primary, theme.colors.error],
    )

    return {
      width: _width,
      backgroundColor: color,
    }
  })

  return (
    <View style={styles.main}>
      <Animated.View style={[styles.progress, animatedStyle]} />
      <Button
        onLayout={(layout) => {
          setWidth(layout.nativeEvent.layout.width)
        }}
        {...(props as ButtonProps)}
      />
    </View>
  )
}

export default TimerButton
