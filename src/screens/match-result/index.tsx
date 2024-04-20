import React, { useEffect, useMemo, useState } from "react"

import { useNavigation, useRoute } from "@react-navigation/native"
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  SafeAreaView,
  View,
  useWindowDimensions,
} from "react-native"
import { IconButton, Text } from "react-native-paper"
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"

import useSearchTicketMutation from "../../hooks/mutations/search-ticket"
import useMatch from "../../hooks/queries/match"
import useMatchResult from "../../hooks/queries/match-result"
import useMatchProgress from "../../hooks/socket/match-progress"
import useStorage from "../../hooks/utils/useStorage"

import Button from "../../components/kit/button"
import Chip from "../../components/kit/chip"
import LottieAnimation from "../../components/kit/lottie-animation"
import MaterialSymbols from "../../components/kit/material-symbols"
import ChallangeResult from "../../components/shared/challenge-result"
import LoadingOverlay from "../../components/shared/loading-overlay"
import MatchOpponents from "../../components/shared/match-opponents"
import MatchResultReactions from "../../components/shared/match-result-reactions"
import ReactionBubble from "../../components/shared/reaction-bubble"
import ScreenHeader from "../../components/shared/screen-header"
import { RootRouteProps, StackScreenParams } from "../../navigation"
import { FONT_BOLD_ITALIC } from "../../styles/typography"
import { IMatchResultState, IMatchState, IResponse } from "../../types"

import useStyles from "./styles"

type RouteProps = RootRouteProps<"match-result">
type ScreenProps = StackScreenParams<"match">

const successAnimation = require("../../assets/animations/trophy_reaction.json")

const clapAnimation = require("../../assets/animations/clap.json")
const angryAnimation = require("../../assets/animations/angry.json")
const thinkAnimation = require("../../assets/animations/think.json")
const explodeAnimation = require("../../assets/animations/explode.json")
const smileAnimation = require("../../assets/animations/smile.json")
const sunglassAnimation = require("../../assets/animations/sunglass.json")

function MatchResult(): JSX.Element {
  const { styles, theme } = useStyles()
  const navigation = useNavigation<ScreenProps>()
  const {
    params: { match_key, robot_finished },
  } = useRoute<RouteProps>()

  const { width } = useWindowDimensions()

  const {
    isFinished,
    opponentReaction,
    setOpponentReaction,
    myReaction,
    setMyReaction,
    sendReaction,
  } = useMatchProgress(match_key)

  const { data: match, isLoading: matchIsLoading } = useMatch(match_key)
  const { data: matchResult, refetch } = useMatchResult(match_key)
  const createSearchTicket = useSearchTicketMutation()
  const [_, setMatchState] = useStorage<IMatchState>("match-state")
  const [__, setMatchResultState] =
    useStorage<IMatchResultState>("match-result-state")

  const [showResults, setShowResults] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  const opponentReactionAnimation = useMemo(() => {
    if (!opponentReaction) return null

    return {
      clap: clapAnimation,
      angry: angryAnimation,
      think: thinkAnimation,
      explode: explodeAnimation,
      smile: smileAnimation,
      sunglasses: sunglassAnimation,
    }[opponentReaction]
  }, [opponentReaction])

  const myReactionAnimation = useMemo(() => {
    if (!myReaction) return null

    return {
      clap: clapAnimation,
      angry: angryAnimation,
      think: thinkAnimation,
      explode: explodeAnimation,
      smile: smileAnimation,
      sunglasses: sunglassAnimation,
    }[myReaction]
  }, [myReaction])

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      // goBack(true)

      return true
    })

    return () => {
      sub.remove()
    }
  }, [])

  useEffect(() => {
    setMatchState(undefined)
    setMatchResultState({ matchKey: match_key })
  }, [])

  useEffect(() => {
    if (setShowReactions) {
      const timer = setTimeout(() => {
        setShowReactions(false)
      }, 5000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [showReactions])

  useEffect(() => {
    if (match?.is_against_computer && !robot_finished) {
      const timer = setTimeout(() => {
        setShowResults(true)
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      setShowResults(true)
    }
  }, [match, robot_finished])

  useEffect(() => {
    if (isFinished) {
      refetch()
    }
  }, [isFinished])

  const isLoading = matchIsLoading || !matchResult || !showResults

  const totalScore = (map: IResponse[]) =>
    map.reduce((a: number, b: IResponse) => {
      if (b.is_correct) return a + 1
      else return a
    }, 0)

  const result = useMemo(() => {
    if (!matchResult) return null

    let label = ""
    let color = theme.colors.onSurface
    let scoreChangeDescription = ""
    let scoreChange = "0"
    let showAnimation = false

    if (matchResult.winner == "you") {
      setShowSuccessAnimation(true)
      showAnimation = true
      label = "G'alaba"
      color = theme.colors.primary
      scoreChangeDescription = "Jangda g’alaba qozonganingiz uchun ball berildi"
      scoreChange = `+${matchResult.your_rank_score_change}`
    }

    if (matchResult.winner == "opponent" || matchResult.winner == "none") {
      label = "Mag'lubiyat"
      color = theme.colors.error
      scoreChangeDescription = "Jangda mag'lub bo'lganingiz uchun ball olindi"
      scoreChange = `${matchResult.your_rank_score_change}`
    }

    if (matchResult.winner == "both") {
      label = "Durrang"
      color = theme.colors.onSurface
      if (matchResult.your_rank_score_change > 0) {
        scoreChangeDescription =
          "Jangni birinchi tugatganingiz uchun ball berildi"
        scoreChange = `+${matchResult.your_rank_score_change}`
      } else {
        scoreChangeDescription =
          "Jangni oxirgi bo'lib tugatganingiz uchun ball berilmadi"
        scoreChange = `+${matchResult.your_rank_score_change}`
      }
    }

    const you = totalScore(matchResult.your_responses)
    const opponent = totalScore(matchResult.opponent_responses)

    return {
      label,
      color,
      scores: {
        you,
        opponent,
      },
      scoreChange,
      scoreChangeDescription,
      showAnimation,
    }
  }, [matchResult])

  useEffect(() => {
    if (result) {
      setMatchResultState(undefined)

      if (!match?.is_against_computer) {
        const timer = setTimeout(
          () => {
            setShowReactions(true)
          },
          result.showAnimation ? 5000 : 2000,
        )

        return () => {
          clearTimeout(timer)
        }
      }
    }
  }, [result])

  const scrollY = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const goBack = (goHome: boolean = false) => {
    setMatchResultState(undefined)

    if (goHome) {
      navigation.goBack()
    } else if (match && !match.is_friendly_match) {
      createSearchTicket
        .mutateAsync(match.topic.id)
        .then(({ ticket_number }) => {
          navigation.replace("match-search", {
            language: match.topic,
            ticket_number,
            with_cooldown: true,
          })
        })
        .catch(() => {})
    } else {
      navigation.goBack()
    }
  }

  const openReviewScreen = () => {
    navigation.navigate("match-result-review", { match_key })
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScreenHeader
        style={styles.appbar}
        scrollY={scrollY}
        title={match?.topic?.name || ""}
        titleStyle={{
          fontSize: 24,
          textAlign: "center",
        }}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        onScroll={scrollHandler}
        contentContainerStyle={styles.body}>
        {!matchIsLoading && match ? (
          <MatchOpponents
            firstOpponent={{
              first_name: match.you.first_name,
              last_name: match.you.last_name,
              rank_score: match.you.rank_score,
              confirmed: true,
            }}
            secondOpponent={{
              first_name: match.opponent.first_name,
              last_name: match.opponent.last_name,
              rank_score: match.opponent.rank_score,
              confirmed: true,
              is_robot: match.is_against_computer,
            }}
            hideRank={match.is_against_computer}
          />
        ) : null}

        {result && matchResult && !isLoading ? (
          <View
            style={{
              marginTop: 24,
              gap: 8,
              flex: 1,
              alignItems: "center",
            }}>
            <Text
              style={{
                fontSize: 56,
                fontFamily: FONT_BOLD_ITALIC,
                fontWeight: "600",
                color: theme.colors.primary,
                letterSpacing: 8,
                zIndex: 1,
              }}>
              {result?.scores?.you}:{result?.scores?.opponent}
            </Text>

            <View
              style={{
                alignItems: "center",
                flexDirection: "column-reverse",
              }}>
              <View style={{ marginTop: 16, gap: 8, zIndex: 0 }}>
                {match?.challenges?.map(({ id }, index: number) => (
                  <ChallangeResult
                    key={id}
                    result={matchResult}
                    challengeId={id}
                    challengeNumber={index + 1}
                    match={match}
                  />
                ))}
              </View>

              <View
                style={{
                  alignItems: "center",
                  width: "100%",
                  zIndex: 10,
                  position: "relative",
                }}>
                {showSuccessAnimation ? (
                  <View
                    style={{
                      zIndex: 5,
                    }}>
                    <LottieAnimation
                      autoPlay
                      style={styles.resultAnimation}
                      source={successAnimation}
                      touchEnabled={false}
                      onAnimationFinish={() => {
                        setShowSuccessAnimation(false)
                      }}
                    />
                  </View>
                ) : null}

                <View
                  style={{
                    zIndex: 1,
                  }}>
                  <Chip
                    active
                    color={result.color}
                    onPress={
                      !match?.is_against_computer
                        ? () => setShowReactions(true)
                        : undefined
                    }>
                    {result.label}
                  </Chip>
                </View>

                {showReactions && !match?.is_against_computer ? (
                  <View
                    style={{
                      zIndex: 10,
                      position: "absolute",
                      top: 40,
                    }}>
                    <MatchResultReactions
                      onSelect={(name) => {
                        setShowReactions(false)
                        sendReaction(name)
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>

            {myReactionAnimation ? (
              <View
                style={{
                  zIndex: 10000,
                  position: "absolute",
                  left: 16,
                  top: -40,
                }}>
                <ReactionBubble
                  reverse
                  onFinish={() => setMyReaction(undefined)}
                  animation={myReactionAnimation}
                />
              </View>
            ) : null}

            {opponentReactionAnimation ? (
              <View
                style={{
                  zIndex: 10000,
                  position: "absolute",
                  right: 16,
                  top: -40,
                }}>
                <ReactionBubble
                  onFinish={() => setOpponentReaction(undefined)}
                  animation={opponentReactionAnimation}
                />
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator color={theme.colors.onSurface} size={32} />
            <Text variant="labelMedium" style={styles.loadingLabel}>
              Raqib kutilmoqda
            </Text>
            {/* <Chip style={{ marginTop: 8, paddingTop: 10 }}>{`${Math.min(
              opponentStep,
              5,
            )}-savolda`}</Chip> */}
          </View>
        )}
      </Animated.ScrollView>

      {!isLoading ? (
        <>
          <View
            style={{
              justifyContent: "flex-end",
            }}>
            <Animated.View
              entering={FadeInDown.delay(200)}
              exiting={FadeOutDown}
              style={styles.scoreChangeContainer}>
              {match?.is_friendly_match ? (
                <View style={styles.scoreChangeDescription}>
                  <Text variant="labelSmall">
                    Do'stona janglarda ball berilmaydi
                  </Text>
                </View>
              ) : match?.is_against_computer ? (
                <View style={styles.scoreChangeDescription}>
                  <Text variant="labelSmall">
                    Robot bilan jangda ball berilmaydi
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.scoreChangeAmount}>
                    <Text variant="titleMedium" style={{ lineHeight: 24 }}>
                      {result?.scoreChange}
                    </Text>
                  </View>
                  <View style={styles.scoreChangeDescription}>
                    <Text variant="labelSmall">
                      {result?.scoreChangeDescription}
                    </Text>
                  </View>
                </>
              )}
            </Animated.View>
          </View>
          <Animated.View
            entering={FadeInDown}
            exiting={FadeOutDown.delay(200)}
            style={styles.footer}>
            <View
              style={{
                flex: 1,
              }}>
              <Button
                color={theme.colors.onSurface}
                left={"arrow_back"}
                onPress={() => goBack()}>
                Tugatish
              </Button>
            </View>
            <IconButton
              style={styles.reviewIcon}
              icon={() => (
                <MaterialSymbols
                  name={"rule"}
                  color={theme.colors.primary}
                  shift={0}
                />
              )}
              iconColor={theme.colors.primary}
              onPress={openReviewScreen}
            />
          </Animated.View>
        </>
      ) : null}
      <LoadingOverlay visible={createSearchTicket.isLoading} />
    </SafeAreaView>
  )
}

export default MatchResult
