import { memo, useEffect, useMemo, useRef, useState } from "react"

import {
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet"
import { View } from "react-native"
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback"
import { Text } from "react-native-paper"

import {
  FRIEND_MATCH_REQUEST_TIMEOUT,
  emitter,
} from "../../../hooks/socket/friends"

import { IMatchRequest } from "../../../types"
import compareProps from "../../../utils/compare-props"
import { useFriendsContext } from "../../context/friends"
import BottomSheet, { BottomSheetMethods } from "../../kit/bottom-sheet"
import Button from "../../kit/button"
import RankCircle from "../rank-circle"
import TimerButton from "../timer-button"

import useStyles from "./styles"

type Props = {
  request: IMatchRequest

  onAccept?: (request: IMatchRequest) => void
  onReject?: (request: IMatchRequest) => void
}

const MatchRequestContent = ({ onAccept, onReject, request }: Props) => {
  const { styles, theme } = useStyles()
  const challenger = request?.challenger
  const language = request?.language
  const accepting = request?.accepting

  return (
    <View style={styles.main}>
      <View
        style={{
          alignItems: "center",
          paddingHorizontal: 8,
          marginBottom: 24,
        }}>
        <RankCircle
          order={challenger?.rank_number}
          animated
          size={120}
          style={styles.rank}
        />

        <Text variant="titleMedium" style={styles.title}>
          <Text style={styles.bold}>
            {challenger?.first_name} {challenger?.last_name}
          </Text>
          {"\n"}
          sizni <Text style={styles.bold}>{language?.name}</Text>
          da jangga chorlamoqda!
        </Text>
      </View>

      <TimerButton
        disabled={accepting}
        duration={FRIEND_MATCH_REQUEST_TIMEOUT}
        onPress={() => onAccept?.(request)}
        onComplete={() => onReject?.(request)}>
        Qabul qilish
      </TimerButton>
      <Button
        color={theme.colors.onBackground}
        onPress={() => onReject?.(request)}>
        Rad etish
      </Button>
    </View>
  )
}

const SheetContent = memo(MatchRequestContent, compareProps(["request"]))

const MatchRequestSheet = () => {
  const snapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])
  const ref = useRef<BottomSheetMethods>(null)
  const [matchRequest, setMatchRequest] = useState<IMatchRequest>()

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints)

  const { acceptMatchRequest, rejectMatchRequest } = useFriendsContext()

  const reject = () => {
    if (matchRequest) {
      rejectMatchRequest?.(matchRequest)
    }
  }

  const onReject = () => {
    ref.current?.close()
  }

  useEffect(() => {
    const onMatchRequest = (matchRequest: IMatchRequest) => {
      setMatchRequest(matchRequest)
      ref.current?.open()

      HapticFeedback.trigger(HapticFeedbackTypes.impactHeavy)
    }

    const onMatchRequestAccepted = () => {
      ref.current?.close()
    }

    emitter.on("match-request", onMatchRequest)
    emitter.on("match-request-accepted", onMatchRequestAccepted)

    return () => {
      emitter.off("match-request", onMatchRequest)
      emitter.off("match-request-accepted", onMatchRequestAccepted)
    }
  }, [])

  const handleAccept = () => {
    if (matchRequest) {
      acceptMatchRequest(matchRequest)

      // @ts-expect-error
      setMatchRequest((prev) => ({
        ...prev,
        accepting: true,
      }))
    }
  }

  return (
    <BottomSheet
      ref={ref}
      index={0}
      onDismiss={reject}
      // @ts-expect-error
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enableDismissOnBackdropPress={false}
      enablePanDownToClose={false}
      enableOverDrag>
      <BottomSheetView onLayout={handleContentLayout}>
        <SheetContent
          onAccept={handleAccept}
          onReject={onReject}
          // @ts-expect-error
          request={matchRequest}
        />
      </BottomSheetView>
    </BottomSheet>
  )
}

export default memo(MatchRequestSheet)
