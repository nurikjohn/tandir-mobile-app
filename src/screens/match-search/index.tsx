import React, { useEffect, useRef, useState } from "react"

import { useNavigation, useRoute } from "@react-navigation/native"
import { Platform, TouchableHighlight, View } from "react-native"
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback"
import KeepAwake from "react-native-keep-awake"
import { Text } from "react-native-paper"
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  ReduceMotion,
  SlideInLeft,
  runOnJS,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"

import useProfile from "../../hooks/queries/profile"
import useMatchSearchSocket from "../../hooks/socket/match-search"
import useAppState from "../../hooks/utils/useAppState"
import useSound from "../../hooks/utils/useSound"

import { useFriendsContext } from "../../components/context/friends"
import Button from "../../components/kit/button"
import Chip from "../../components/kit/chip"
import LottieAnimation from "../../components/kit/lottie-animation"
import OutlinedNumber from "../../components/kit/outlined-number"
import SafeAreaView from "../../components/kit/safe-area-view"
import AnimatedTimer from "../../components/shared/animated-timer/intex"
import LoadingOverlay from "../../components/shared/loading-overlay"
import MatchOpponents from "../../components/shared/match-opponents"
import { RootRouteProps, StackScreenParams } from "../../navigation"

import useStyles from "./styles"

const searchingAnimation = require("../../assets/animations/searching.json")
const robotAnimation = require("../../assets/animations/robot.json")

type ScreenProps = StackScreenParams<"match-search">
type RouteProps = RootRouteProps<"match-search">

const SHOW_BOT_TIMEOUT = 10

function MatchSearch(): JSX.Element {
  const { goBack, replace } = useNavigation<ScreenProps>()
  const [remaining, setRemaining] = useState(10)
  const { params } = useRoute<RouteProps>()
  const animationRef = useRef<any>()
  const firstIteration = useRef(true)

  const [showTimer, setShowTimer] = useState(false)
  const [showBot, setShowBot] = useState(false)
  const [showBotHint, setShowBotHint] = useState(false)
  const [clearBotHint, setClearBotHint] = useState(false)
  const [botPressMaxProgress, setBotProgressMaxWidth] = useState(0)
  const botPressProgress = useSharedValue(0)
  const skipCount = useRef(true)
  const confirmedRef = useRef(false)
  const opponentFoundSound = useSound("opponent_found_sound")
  const countdownSound = useSound("countdown_8_bit", 0.5)

  const { data: profile } = useProfile()
  const {
    matchFound,
    opponentConfirmed,
    waitingOpponent,
    matchConfirmed,
    matchKey,
    opponent,
    confirm,
    reset,
    matchWithRobot,
    isLoading,
    disconnect,
    reconnect,
    cooldown,
    isPenalty,
    isConnected,
  } = useMatchSearchSocket(
    params.ticket_number,
    params.language,
    params.with_cooldown,
  )

  const { hasOngoingMatch } = useFriendsContext()

  useEffect(() => {
    setShowTimer(true)
    hasOngoingMatch.current = true
    KeepAwake.activate()

    return () => {
      hasOngoingMatch.current = false
      KeepAwake.deactivate()
    }
  }, [])

  const { styles, theme } = useStyles({ isPenalty })

  useEffect(() => {
    if (matchFound || cooldown) {
      botPressProgress.value = withTiming(0, {
        duration: 200,
        reduceMotion: ReduceMotion.Never,
      })
    }
  }, [matchFound, cooldown])

  useEffect(() => {
    let interval: any

    if (matchConfirmed) return

    if (matchFound) {
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: true,
      }
      HapticFeedback.trigger(HapticFeedbackTypes.impactHeavy, options)

      skipCount.current = true
      opponentFoundSound.play(() => {
        skipCount.current = false
      })

      interval = setInterval(() => {
        setRemaining((old) => {
          if (skipCount.current) {
            return old
          }

          if (old <= 1 && interval) {
            clearInterval(interval)
            return 0
          }

          if (!confirmedRef.current) countdownSound.play()

          HapticFeedback.trigger(
            Platform.select({
              android: HapticFeedbackTypes.impactHeavy,
              ios: HapticFeedbackTypes.clockTick,
            }),
            {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: true,
            },
          )

          return old - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
      setRemaining(10)
    }
  }, [matchFound, matchConfirmed])

  useEffect(() => {
    if (waitingOpponent) {
      confirmedRef.current = true
    } else {
      confirmedRef.current = false
    }
  }, [waitingOpponent])

  useEffect(() => {
    if (remaining == 0) {
      reset()
      setRemaining(10)
    }
  }, [remaining])

  useEffect(() => {
    if (matchConfirmed && matchKey) {
      replace("match", { match_key: matchKey })
    }
  }, [matchConfirmed, matchKey])

  const { isActive } = useAppState()

  useEffect(() => {
    if (isActive) {
      if (animationRef.current) {
        animationRef.current.play?.()
      }
    }
  }, [isActive])

  useEffect(() => {
    const timer = setTimeout(() => {
      animationRef.current?.play?.()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showBotHint && clearBotHint) {
      const timer = setTimeout(() => {
        setClearBotHint(false)
        setShowBotHint(false)
      }, 3200)

      return () => clearTimeout(timer)
    }
  }, [showBotHint, clearBotHint])

  const startMatchWithRobot = () => {
    disconnect()
    HapticFeedback.trigger(HapticFeedbackTypes.notificationSuccess)
    matchWithRobot().catch(() => {
      reconnect()
    })
  }

  const onBotPressIn = () => {
    setClearBotHint(false)
    setShowBotHint(true)

    HapticFeedback.trigger(HapticFeedbackTypes.selection)

    botPressProgress.value = withDelay(
      200,
      withTiming(
        botPressMaxProgress - 4,
        { duration: 3000, reduceMotion: ReduceMotion.Never },
        (finished) => {
          if (finished) {
            runOnJS(startMatchWithRobot)()
          }
        },
      ),
    )
  }

  const onBotPressOut = () => {
    if (botPressProgress.value < botPressMaxProgress - 4) {
      botPressProgress.value = withTiming(0, {
        duration: 200,
        reduceMotion: ReduceMotion.Never,
      })
      setClearBotHint(true)
    }
  }

  const timerCallBack = (ellapsed: number) => {
    if (ellapsed >= SHOW_BOT_TIMEOUT) {
      setShowBot((prev) => {
        if (!prev) {
          setTimeout(() => {
            setClearBotHint(true)
            setShowBotHint(true)
          }, 500)
        }

        return true
      })
    } else if (ellapsed < SHOW_BOT_TIMEOUT) {
      setShowBot(false)
    }
  }

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <View style={styles.main}>
          <View style={styles.heading}>
            {matchFound && profile && opponent ? (
              <View style={styles.matchContainer}>
                <Chip>{params.language.name}</Chip>
                <MatchOpponents
                  firstOpponent={{
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    rank_score: profile.rank_score,
                    confirmed: waitingOpponent,
                  }}
                  secondOpponent={{
                    first_name: opponent.first_name,
                    last_name: opponent.last_name,
                    rank_score: opponent.rank_score,
                    confirmed: opponentConfirmed,
                  }}
                  hideRank
                />
              </View>
            ) : !cooldown ? (
              <>
                <Text variant="headlineMedium">Raqib{"\n"}qidirilmoqda...</Text>
              </>
            ) : null}
          </View>

          <View
            style={[
              styles.body,
              {
                paddingBottom: matchFound ? 120 : 72,
              },
            ]}>
            {matchFound ? (
              <OutlinedNumber width={150} height={150} number={remaining} />
            ) : cooldown ? (
              <View style={styles.cooldownContainer}>
                <AnimatedTimer
                  countdown
                  duration={isPenalty ? 10 : 3}
                  style={styles.cooldownTimer}
                  done={() => {
                    reconnect()
                  }}
                />
                <Text style={styles.cooldownDescription} variant="bodySmall">
                  {isPenalty
                    ? "Topilgan jangni qabul qilmaganingiz uchun kuting"
                    : "Qidiruv boshlanishini kuting"}
                </Text>
              </View>
            ) : (
              <Animated.View entering={FadeIn.delay(200)}>
                <LottieAnimation
                  speed={1.3}
                  style={styles.loading}
                  source={searchingAnimation}
                  loop
                  autoPlay
                  ref={animationRef}
                  instant
                />
              </Animated.View>
            )}
          </View>

          {!matchFound && !cooldown ? (
            <View style={{ alignItems: "center" }}>
              {showBotHint ? (
                <Animated.View style={styles.botHintContainer}>
                  <Animated.View
                    entering={FadeInDown}
                    exiting={FadeOutDown}
                    onLayout={({
                      nativeEvent: {
                        layout: { width },
                      },
                    }) => {
                      setBotProgressMaxWidth(width)
                    }}
                    style={styles.timerBox}>
                    <Text style={styles.timerText} variant="bodySmall">
                      Bot bilan jang qilish uchun bosib turing
                    </Text>
                    <Animated.View
                      style={[
                        styles.botPressProgress,
                        {
                          width: botPressProgress,
                        },
                      ]}
                    />
                  </Animated.View>
                </Animated.View>
              ) : null}

              <Animated.View style={[styles.timerContainer]}>
                {showTimer ? (
                  <Animated.View
                    layout={LinearTransition.duration(250)}
                    entering={FadeInDown.delay(250)}
                    style={styles.timerBox}>
                    <AnimatedTimer
                      style={styles.timerText}
                      tick={timerCallBack}
                    />
                  </Animated.View>
                ) : null}

                {showBot ? (
                  <TouchableHighlight
                    underlayColor={"transparent"}
                    onPressIn={onBotPressIn}
                    onPressOut={onBotPressOut}>
                    <Animated.View
                      entering={SlideInLeft.withInitialValues({
                        originX: -50,
                      }).duration(300)}>
                      <LottieAnimation
                        style={styles.robotAnimation}
                        source={robotAnimation}
                        autoPlay
                        touchEnabled={false}
                      />
                    </Animated.View>
                  </TouchableHighlight>
                ) : null}
              </Animated.View>
            </View>
          ) : null}

          <View style={styles.footer}>
            {matchFound ? (
              <Button
                onPress={confirm}
                disabled={waitingOpponent || !isConnected}
                loading={!isConnected}>
                {waitingOpponent ? "Raqib kutilmoqda..." : "Boshlash"}
              </Button>
            ) : (
              <Button
                color={theme.colors.onSurface}
                onPress={goBack}
                left={"arrow_back"}>
                Bekor qilish
              </Button>
            )}
          </View>
        </View>
      </SafeAreaView>
      <LoadingOverlay visible={isLoading} />
    </>
  )
}

export default MatchSearch
