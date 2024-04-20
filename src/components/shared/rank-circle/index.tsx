import { memo, useMemo } from "react"

import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "react-native-paper"

import compareProps from "../../../utils/compare-props"
import LottieAnimation from "../../kit/lottie-animation"

import useStyles from "./styles"

const animationMedal1 = require("../../../assets/animations/medal_1.json")
const animationMedal2 = require("../../../assets/animations/medal_2.json")
const animationMedal3 = require("../../../assets/animations/medal_3.json")

const imageMedal1 = require("../../../assets/images/medal-1.png")
const imageMedal2 = require("../../../assets/images/medal-2.png")
const imageMedal3 = require("../../../assets/images/medal-3.png")

type Props = {
  active?: boolean
  animated?: boolean
  autoPlay?: boolean
  size?: number
  order: number
  style?: ViewStyle
}

const RankCircle = ({
  size = 48,
  active,
  autoPlay,
  animated,
  order,
  style,
}: Props) => {
  const { styles } = useStyles({ active, size, order })

  const animation = useMemo(() => {
    if (!animated) return null

    if (order == 1) return animationMedal1
    if (order == 2) return animationMedal2
    if (order == 3) return animationMedal3

    return null
  }, [animated, order])

  const firstFrame = useMemo(() => {
    if (!animated) return null

    if (order == 1) return imageMedal1
    if (order == 2) return imageMedal2
    if (order == 3) return imageMedal3

    return null
  }, [animated, order])

  return (
    <View style={[styles.main, style]}>
      {animation ? (
        <LottieAnimation
          autoPlay={autoPlay}
          style={styles.animation}
          source={animation}
          frame={firstFrame}
          delay={2000}
        />
      ) : (
        <Text variant="titleMedium" style={styles.text}>
          {order}
        </Text>
      )}
    </View>
  )
}

export default memo(RankCircle, compareProps(["active", "animated", "order"]))
