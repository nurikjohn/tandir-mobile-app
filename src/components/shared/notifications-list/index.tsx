import React, { memo, useCallback } from "react"

import { useNavigation } from "@react-navigation/native"
import { FlashList, FlashListProps } from "@shopify/flash-list"
import { View } from "react-native"
import { ActivityIndicator } from "react-native"
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated"

import useNotifications from "../../../hooks/queries/notifications"

import { INotification } from "../../../types"
import compareProps from "../../../utils/compare-props"
import NoData from "../no-data"
import NotificationsItem from "../notifications-item"

import useStyles from "./styles"

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<INotification>>(FlashList)

interface Props {
  scrollY: SharedValue<number>
  onItemPress: any
}

const NotificationsList = ({ scrollY, onItemPress }: Props) => {
  const { styles, theme } = useStyles()

  const { data: notifications, isLoading } = useNotifications()

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const renderItem = useCallback(
    ({ item, index }: { item: INotification; index: number }) => {
      return (
        <NotificationsItem
          item={item}
          index={index}
          onPress={() => onItemPress?.(item)}
        />
      )
    },
    [],
  )

  return (
    <NoData loading={isLoading} hasData={!!notifications?.length}>
      <AnimatedFlashList
        data={notifications}
        renderItem={renderItem}
        estimatedItemSize={64}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
      />
    </NoData>
  )
}

export default memo(NotificationsList, compareProps([]))
