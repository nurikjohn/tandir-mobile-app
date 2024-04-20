import { memo, useCallback, useEffect, useMemo, useState } from "react"

import { Alert, GestureResponderEvent, View } from "react-native"
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback"
import { IconButton, Text } from "react-native-paper"
import Animated, {
  FadeInDown,
  ZoomIn,
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"

import { FRIEND_MATCH_REQUEST_TIMEOUT } from "../../../hooks/socket/friends"
import { emitter } from "../../../hooks/socket/friends"

import { IFriend } from "../../../types"
import compareProps from "../../../utils/compare-props"
import { useFriendsContext } from "../../context/friends"
import MaterialSymbols, { IconName } from "../../kit/material-symbols"
import Pressable from "../../kit/pressable"
import RankCircle from "../rank-circle"
import UserFirstName from "../user-first-name"
import UserProfilePreview from "../user-profile-preview"

import useStyles from "./styles"

const PINGABLE_INTERVAL = 60

type Props = {
  item: IFriend

  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined

  sendRequest: (friend: IFriend) => void
  pingFriend: (friend: IFriend, cb: (...args: any[]) => void) => void

  active?: boolean
  animated?: boolean
  autoPlay?: boolean
  order: number
  layoutAnimationEnabled?: boolean
}

const FriendsItem = ({
  item,
  order,
  onPress,
  animated,
  autoPlay,
  sendRequest,
  pingFriend,
  layoutAnimationEnabled,
}: Props) => {
  const translateX = useSharedValue(0)
  const { styles, theme } = useStyles()
  const { isConnected: isSocketConnected } = useFriendsContext()
  const [pinging, setPinging] = useState(false)
  const [pinged, setPinged] = useState(false)
  const [open, setOpen] = useState(false)

  const [requestStatus, setRequestStatus] = useState<
    "sending" | "pending" | "accepted" | "rejected" | undefined
  >()

  useEffect(() => {
    if (requestStatus) {
      let timer: NodeJS.Timeout

      if (requestStatus == "rejected") {
        timer = setTimeout(() => {
          setRequestStatus(undefined)
        }, 1e3)
      } else {
        timer = setTimeout(() => {
          setRequestStatus(undefined)
        }, (FRIEND_MATCH_REQUEST_TIMEOUT + 3) * 1e3)
      }

      return () => {
        clearTimeout(timer)
      }
    }
  }, [requestStatus])

  useEffect(() => {
    const onMatchRequestSent = (friend: IFriend) => {
      if (friend.id == item.id) {
        setRequestStatus("sending")
      }
    }

    const onMatchRequestReceived = (friend: IFriend) => {
      if (friend.id == item.id) {
        setRequestStatus("pending")
      }
    }

    const onMatchRequestRejected = (id: number) => {
      if (id == item.id) {
        setRequestStatus("rejected")
        startShake()
      }
    }

    const onMatchRequestErrored = (id: number) => {
      if (id == item.id) {
        setRequestStatus(undefined)
      }
    }

    emitter.on("match-request-sent", onMatchRequestSent)
    emitter.on("match-request-errored", onMatchRequestErrored)
    emitter.on("match-request-received", onMatchRequestReceived)
    emitter.on("match-request-rejected", onMatchRequestRejected)

    return () => {
      emitter.off("match-request-sent", onMatchRequestSent)
      emitter.off("match-request-errored", onMatchRequestErrored)
      emitter.off("match-request-received", onMatchRequestReceived)
      emitter.off("match-request-rejected", onMatchRequestRejected)
    }
  }, [])

  useEffect(() => {
    if (pinged) {
      const timer = setTimeout(() => {
        setPinged(false)
      }, PINGABLE_INTERVAL * 1000)

      return () => clearTimeout(timer)
    }
  }, [pinged])

  const { color, iconColor, icon, disabled, shown } = useMemo(() => {
    let color = theme.colors.surface
    let iconColor = theme.colors.onBackground
    let disabled = true
    let shown = false

    let icon: IconName = "flash_on"

    if (!isSocketConnected) {
      return { color, iconColor, icon, disabled, shown }
    }

    if (item.is_me) {
      shown = false
      return { color, iconColor, icon, disabled, shown }
    }

    if (requestStatus == "sending") {
      color = theme.colors.primary
      iconColor = theme.colors.onPrimary
      disabled = true
      shown = true

      icon = "more_horiz"
    } else if (requestStatus == "pending") {
      color = theme.colors.primary
      iconColor = theme.colors.onPrimary
      disabled = true
      shown = true

      icon = "schedule"
    } else if (requestStatus == "rejected") {
      color = theme.colors.error
      iconColor = theme.colors.onError
      disabled = true
      shown = true

      icon = "block"
    } else if (item.status == "online") {
      color = theme.colors.primary
      iconColor = theme.colors.onPrimary
      disabled = false
      shown = true

      icon = "flash_on"
    } else if (
      item.status == "searching" ||
      item.status == "friendly_challenge_queue"
    ) {
      color = theme.colors.surface
      iconColor = theme.colors.onBackground
      disabled = true
      shown = true

      icon = "search"
    } else if (item.status == "dueling") {
      color = theme.colors.surface
      iconColor = theme.colors.onBackground
      disabled = true
      shown = true

      icon = "swords"
    } else if (item.is_push_enabled) {
      color = theme.colors.surface
      iconColor = theme.colors.onBackground
      disabled = false
      icon = "flash_on"
      shown = true

      if (pinging) {
        icon = "more_horiz"
        disabled = true
      }

      if (pinged) {
        icon = "notifications_active"
        disabled = true
      }
    }

    return { color, iconColor, icon, disabled, shown }
  }, [
    item.status,
    item.is_push_enabled,
    requestStatus,
    theme,
    pinging,
    pinged,
    isSocketConnected,
  ])

  const startShake = () => {
    translateX.value = withSequence(
      withTiming(7, {
        duration: 100,
      }),
      withTiming(-7, {
        duration: 100,
      }),
      withTiming(7, {
        duration: 100,
      }),
      withTiming(-7, {
        duration: 100,
      }),
      withTiming(7, {
        duration: 100,
      }),
      withTiming(0, {
        duration: 100,
      }),
    )

    HapticFeedback.trigger(HapticFeedbackTypes.notificationError)
  }

  const iconComponent = useCallback(
    () => <MaterialSymbols shift={0} name={icon} color={iconColor} />,
    [icon, iconColor],
  )

  const handlePress = () => {
    if (item.status == "offline" && item.is_push_enabled) {
      if (pinged) {
        Alert.alert(
          "Tandirga chaqirishga urinyapmiz",
          `${item.first_name} bilan bog'lanyapmiz, do'stingizning onlayn bo'lishini kuting`,
        )
      } else {
        pingFriendAlert(item, (err) => {
          setPinging(false)
          if (!err) {
            setPinged(true)
          }
        })
      }
    } else {
      sendRequest(item)
    }
  }

  const pingFriendAlert = (friend: IFriend, cb: (...args: any[]) => void) => {
    Alert.alert("Do'stingiz onlayn emas", "Uni Tandirga chaqirasizmi?", [
      {
        text: "Yo'q",
        style: "cancel",
      },
      {
        text: "Chaqirish",
        onPress: () => {
          setPinging(true)
          pingFriend(friend, cb)
        },
        isPreferred: true,
      },
    ])
  }

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    }),
    [translateX],
  )

  return (
    <Animated.View
      entering={
        layoutAnimationEnabled
          ? FadeInDown.delay(order * 50).springify()
          : undefined
      }>
      <UserProfilePreview
        onClose={() => setOpen(false)}
        open={open}
        user_id={item.id}
        disabled={item.is_me}
        onPreviewPress={onPress}>
        <Pressable
          onLongPress={() => {
            setOpen(true)
          }}
          onPress={onPress}>
          <Animated.View style={animatedStyle}>
            <View style={styles.main}>
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

              {shown ? (
                <Animated.View
                  key={`${icon}-${color}`}
                  entering={ZoomIn}
                  exiting={ZoomOut}>
                  <IconButton
                    mode="contained"
                    style={styles.button}
                    onPress={!disabled ? handlePress : undefined}
                    containerColor={color}
                    icon={iconComponent}
                  />
                </Animated.View>
              ) : null}
            </View>
          </Animated.View>
        </Pressable>
      </UserProfilePreview>
    </Animated.View>
  )
}

export default memo(
  FriendsItem,
  compareProps<Props>(["item", "order", "animated"]),
)
