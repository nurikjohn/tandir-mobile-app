import React, { memo, useCallback, useEffect, useState } from "react"

import { FlashList, FlashListProps } from "@shopify/flash-list"
import { Platform, RefreshControl } from "react-native"
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated"

import useLeaderboard from "../../../hooks/queries/leaderboard"

import { ILeaderBoardItem } from "../../../types"
import compareProps from "../../../utils/compare-props"
import LeaderboardItem from "../leaderboard-item"
import ListDivider from "../list-divider"
import NoData from "../no-data"

import useStyles from "./styles"

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<ILeaderBoardItem>>(FlashList)

interface Props {
  scrollY: SharedValue<number>
  onItemPress?: (item: ILeaderBoardItem) => void
}

const Leaderboard = ({ scrollY, onItemPress }: Props) => {
  const { styles, theme } = useStyles()

  const [refreshing, setRefreshing] = useState(false)
  const {
    data: leaderboard,
    isRefetching,
    refetch,
    isLoading,
  } = useLeaderboard()

  useEffect(() => {
    if (!isRefetching)
      setTimeout(() => {
        setRefreshing(isRefetching)
      }, 100)
  }, [isRefetching])

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const renderItem = useCallback(
    ({ item, index }: { item: ILeaderBoardItem; index: number }) => {
      if (item.isDivider) return <ListDivider index={index} key={"divider"} />

      return (
        <LeaderboardItem
          item={item}
          order={item.rank_number || index + 1}
          animated={index < 3}
          autoPlay={Platform.select({ ios: true, default: false })}
          index={index}
          onPress={() => {
            onItemPress?.(item)
          }}
        />
      )
    },
    [],
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch()
  }, [])

  return (
    <NoData loading={isLoading} hasData={!!leaderboard?.length}>
      <AnimatedFlashList
        data={leaderboard}
        renderItem={renderItem}
        estimatedItemSize={64}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) =>
          item.isDivider ? "divider" : item.id.toString()
        }
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        getItemType={(item) => {
          return item.isDivider ? "divider" : "item"
        }}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={theme.colors.surface}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </NoData>
  )
}

export default memo(Leaderboard, compareProps([]))
