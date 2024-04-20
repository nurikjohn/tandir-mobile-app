import React, { memo, useCallback, useEffect, useMemo, useState } from "react"

import { FlashList, FlashListProps } from "@shopify/flash-list"
import { RefreshControl, View } from "react-native"
import { Platform } from "react-native"
import { ActivityIndicator } from "react-native"
import { IconButton, List, Text } from "react-native-paper"
import Animated, {
  FadeInDown,
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated"

import usePingFriendMutation from "../../../hooks/mutations/ping-friend"
import useFriends from "../../../hooks/queries/friends"

import { IFriend } from "../../../types"
import compareProps from "../../../utils/compare-props"
import MaterialSymbols from "../../kit/material-symbols"
import FriendsItem from "../friends-item"
import NoData from "../no-data"

import useStyles from "./styles"

type ListProps = FlashListProps<IFriend>

const AnimatedFlashList = Animated.createAnimatedComponent<ListProps>(FlashList)

interface Props {
  scrollY?: SharedValue<number>
  onSendRequest: (friend: IFriend) => void
  onItemPress: (friend: IFriend) => void
}

const FriendsList = ({ scrollY, onItemPress, onSendRequest }: Props) => {
  const { styles, theme } = useStyles()

  const [height, setHeight] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const { data: friends, refetch, isRefetching, isLoading } = useFriends()
  const { mutateAsync: pingFriend } = usePingFriendMutation()

  const HINTS = useMemo(
    () => [
      {
        id: 1,
        description:
          "onlayn, u bilan hoziroq jang tashkil qilishingiz mumkin. Tugmani bosing!",
        icon: "flash_on",
        color: theme.colors.primary,
        iconColor: theme.colors.onPrimary,
      },
      {
        id: 2,
        description:
          "ayni paytda onlayn emas, lekin unga bildirishnoma jo’natib Tandirga chaqirishingiz mumkin, tugmani bosing!",
        icon: "flash_on",
        color: theme.colors.surface,
        iconColor: theme.colors.onBackground,
      },
      {
        id: 3,
        description:
          "jang uchun raqib qidirmoqda, balki sizni topar? Qidiruvga o’ting!",
        icon: "search",
        color: theme.colors.surface,
        iconColor: theme.colors.onBackground,
      },
      {
        id: 4,
        description:
          "ayni paytda jangda, kimga qarshi kurashayotganini bilmaymiz, lekin oson jang emasligi aniq…",
        icon: "swords",
        color: theme.colors.surface,
        iconColor: theme.colors.onBackground,
      },
    ],
    [theme],
  )

  useEffect(() => {
    if (!isRefetching) {
      const timer = setTimeout(() => {
        setRefreshing(isRefetching)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isRefetching])

  const scrollHandler = useAnimatedScrollHandler((event) => {
    if (scrollY) scrollY.value = event.contentOffset.y
  })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch()
  }, [])

  const onPingFriend = (friend: IFriend, cb: (...args: any[]) => void) => {
    pingFriend?.({ friend_id: friend.id })
      .then((data) => {
        if (data?.ok) {
          cb(null, { pinged: true })
        }
      })
      .catch((err) => {
        cb(err, { pinged: true })
      })
  }

  const renderItem = useCallback(
    ({ item, index }: { item: IFriend; index: number }) => {
      return (
        <FriendsItem
          item={item}
          order={item.rank_number}
          animated={index < 3}
          autoPlay={Platform.select({ ios: true, default: false })}
          sendRequest={onSendRequest}
          pingFriend={onPingFriend}
          layoutAnimationEnabled={index < (height / 64) * 1.5}
          onPress={() => {
            onItemPress?.(item)
          }}
        />
      )
    },
    [height],
  )

  const ListFooterComponent = useCallback(() => {
    const length = friends?.length || 0

    if (length <= 2) {
      return (
        <Animated.View
          style={{
            marginTop: 24,
            padding: 16,
            paddingRight: 8,
            gap: 16,
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: theme.colors.surface,
            marginHorizontal: 8,
          }}
          entering={FadeInDown.delay((length + 1) * 50).springify()}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 8,
            }}>
            <Text variant="titleMedium">Do'stingiz...</Text>
            <MaterialSymbols
              name={"info"}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
          {HINTS.map(({ description, icon, color, iconColor, id }) => (
            <View key={id} style={styles.listFooterHint}>
              <IconButton
                mode="contained"
                style={styles.button}
                containerColor={color}
                icon={() => (
                  <MaterialSymbols
                    shift={0}
                    // @ts-expect-error
                    name={icon}
                    color={iconColor}
                  />
                )}
              />
              <View
                style={{ flex: 1, paddingTop: 2, justifyContent: "center" }}>
                <Text variant="bodySmall" style={styles.listFooterHintDesc}>
                  {description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>
      )
    }

    if (length <= 5) {
      return (
        <Animated.View
          entering={FadeInDown.delay(
            ((friends?.length || 0) + 1) * 50,
          ).springify()}>
          <Text variant="bodySmall" style={styles.listFooter}>
            Onlayn bo'lib turgan do'stlaringiz bilan jang tashkil qilish uchun{" "}
            <View style={styles.textIconContainer}>
              <MaterialSymbols
                size={18}
                name={"flash_on"}
                style={styles.textIcon}
              />
            </View>{" "}
            tugmasini bosing
          </Text>
        </Animated.View>
      )
    }

    return null
  }, [friends?.length])

  return (
    <NoData loading={isLoading} hasData={!!friends?.length}>
      <AnimatedFlashList
        onLayout={(e) => {
          setHeight(e.nativeEvent.layout.height)
        }}
        data={friends}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        estimatedItemSize={64}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={theme.colors.surface}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListFooterComponent={ListFooterComponent}
      />
    </NoData>
  )
}

export default memo(FriendsList, compareProps([]))
