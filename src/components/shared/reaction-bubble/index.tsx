import React, { useEffect, useMemo, useRef } from "react"

import { AnimationObject } from "lottie-react-native"
import moment from "moment"
import { View } from "react-native"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"

import LottieAnimation from "../../kit/lottie-animation"

import useStyles from "./styles"

interface Props {
  reverse?: boolean
  onFinish: any
  animation:
    | string
    | AnimationObject
    | {
        uri: string
      }
}

const ReactionBubble = ({ reverse, onFinish, animation }: Props) => {
  const { styles } = useStyles()

  const ref = useRef<any>()

  useEffect(() => {
    const start = new Date().getTime()

    ref.current?.play()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = (now - start) / 1000

      if (diff > 3) {
        onFinish?.()
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [animation])

  return (
    <View>
      <Animated.View
        entering={ZoomIn.delay(100)}
        exiting={ZoomOut}
        style={styles.main}>
        <LottieAnimation
          ref={ref}
          touchEnabled={false}
          source={animation}
          style={styles.animation}
        />
      </Animated.View>
      <Animated.View
        entering={ZoomIn.delay(50)}
        exiting={ZoomOut.delay(50)}
        style={reverse ? styles.bubble2Left : styles.bubble2}
      />
      <Animated.View
        entering={ZoomIn}
        exiting={ZoomOut.delay(100)}
        style={reverse ? styles.bubble1Left : styles.bubble1}
      />
    </View>
  )
}

export default ReactionBubble
