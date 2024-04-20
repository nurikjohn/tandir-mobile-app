import { ReactElement, memo, useState } from "react"

import { Alert, GestureResponderEvent, View, ViewStyle } from "react-native"
import { Text } from "react-native-paper"
import Animated, { FadeInDown } from "react-native-reanimated"

import queryClient from "../../../services/react-query"
import { ILeaderBoardItem } from "../../../types"
import compareProps from "../../../utils/compare-props"
import Pressable from "../../kit/pressable"
import RankCircle from "../rank-circle"
import UserFirstName from "../user-first-name"
import UserProfilePreview from "../user-profile-preview"

import useStyles from "./styles"

type Props = {
  item: ILeaderBoardItem

  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined
  style?: ViewStyle
  active?: boolean
  animated?: boolean
  autoPlay?: boolean
  order: number
  right?: ReactElement
  index?: number
}

const LeaderboardItem = ({
  item,
  order,
  onPress,
  style,
  animated,
  autoPlay,
  right,
  index = 0,
}: Props) => {
  const { styles } = useStyles()
  const [open, setOpen] = useState(false)

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <UserProfilePreview
        open={open}
        onClose={() => setOpen(false)}
        user_id={item.id}
        disabled={item.is_me}
        onPreviewPress={onPress}>
        <Pressable
          onLongPress={() => {
            setOpen(true)
          }}
          onPress={onPress}>
          <View style={[styles.main, style]}>
            <RankCircle
              active={item.is_me}
              order={order}
              animated={animated}
              autoPlay={autoPlay}
            />

            <View style={styles.content}>
              <UserFirstName name={item.first_name} />
              <Text
                style={styles.subtitle}
                numberOfLines={1}
                variant="labelMedium">
                {item.last_name}
              </Text>
            </View>

            {right ? (
              right
            ) : (
              <Text variant="titleMedium">{item.rank_score}</Text>
            )}
          </View>
        </Pressable>
      </UserProfilePreview>
    </Animated.View>
  )
}

export default memo(
  LeaderboardItem,
  compareProps<Props>(["item", "order", "style", "animated", "right"]),
)
