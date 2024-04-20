import { memo } from "react"

import { View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import compareProps from "../../../utils/compare-props"

import useStyles from "./styles"

const ListDivider = ({ index = 0 }: { index?: number }) => {
  const { styles } = useStyles()

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={styles.main}>
      <View style={styles.dot} />
      <View style={styles.dot} />
      <View style={styles.dot} />
    </Animated.View>
  )
}

export default memo(ListDivider, compareProps())
