import { memo, useMemo } from "react"

import Color from "color"
import moment from "moment"
import { GestureResponderEvent, View } from "react-native"
import FastImage from "react-native-fast-image"
import { Text, TouchableRipple } from "react-native-paper"
import Animated, { FadeInDown } from "react-native-reanimated"

import { INotification } from "../../../types"
import compareProps from "../../../utils/compare-props"

import useStyles from "./styles"

type Props = {
  item: INotification

  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined

  index: number
}

const NotificationItem = ({ item, onPress, index }: Props) => {
  const { styles, theme } = useStyles({ active: !item.is_read })

  const formatedDate = useMemo(() => {
    return moment(item.published_time * 1000).format("DD.MM.YY")
  }, [item])

  const image = useMemo(() => {
    const REGEX = new RegExp(/\<img (.*)src="(.+)"\/\>/)
    let image: string | undefined = undefined

    const match = item.body.match(REGEX)

    if (match?.[2]) {
      image = match?.[2]
    }

    return image
  }, [item])

  const rippleColor = useMemo(() => {
    if (item.is_read) {
      return Color.rgb(theme.colors.onSurfaceVariant).alpha(0.1).string()
    }

    return Color.rgb(theme.colors.primary).alpha(0.1).string()
  }, [item])

  return (
    <Animated.View
      style={{
        marginBottom: 8,
      }}
      entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableRipple rippleColor={rippleColor} onPress={onPress}>
        <View style={styles.main}>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title}>
              {item.title}
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {formatedDate}
            </Text>
          </View>
          <Text variant="bodyMedium" style={{}}>
            {item.short_description}
          </Text>

          {image ? (
            <FastImage
              source={{
                uri: image,
              }}
              style={styles.image}
            />
          ) : null}
        </View>
      </TouchableRipple>
    </Animated.View>
  )
}

export default memo(NotificationItem, compareProps<Props>(["item"]))
