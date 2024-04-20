import { memo } from "react"

import { TouchableHighlight, View } from "react-native"
import { Text } from "react-native-paper"
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated"

import { IMonthlyActivityPrepared } from "../../../types"
import compareProps from "../../../utils/compare-props"

import { CustomEnteringAnimation } from "./animation"
import useStyles from "./styles"

type Props = {
  data: IMonthlyActivityPrepared
  index: number
  active: boolean
  onPress: () => void
}

const ActivityTile = ({ data, index, active, onPress }: Props) => {
  const { styles, theme } = useStyles({
    active: data.is_today,
    index,
    shown: data.shown,
  })

  return (
    <View style={styles.main}>
      {active ? (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutUp}
          style={styles.popoverContainer}>
          <View style={styles.popover}>
            <Text variant="labelSmall" style={styles.popoverText}>
              {data.date}da {data.matches} ta jang
            </Text>
          </View>
          <View style={styles.popoverPointer} />
        </Animated.View>
      ) : null}

      <Animated.View
        entering={CustomEnteringAnimation(
          (Math.floor(Math.random() * 100) % 28) * 10,
          400,
        )}
        key={data.date}
        style={[styles.cell]}>
        <TouchableHighlight
          underlayColor={theme.colors.primary}
          onPress={onPress}>
          <View
            style={[
              styles.cellContent,
              {
                opacity: data.activity,
              },
            ]}
          />
        </TouchableHighlight>
      </Animated.View>
    </View>
  )
}

export default memo(ActivityTile, compareProps(["active", "data"]))
