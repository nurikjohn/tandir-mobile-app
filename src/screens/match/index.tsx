import React, { useEffect, useMemo } from "react"

import { MATCH_DURATION } from "@env"
import { useNavigation, useRoute } from "@react-navigation/native"
import {
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native"
import { Text } from "react-native-paper"
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
  LinearTransition,
} from "react-native-reanimated"

import { useFriendsContext } from "../../components/context/friends"
import Code from "../../components/kit/code"
import Option from "../../components/kit/option"
import RenderWhen from "../../components/kit/render-when"
import LoadingOverlay from "../../components/shared/loading-overlay"
import TimerButton from "../../components/shared/timer-button"
import { RootRouteProps, StackScreenParams } from "../../navigation"

import useStyles from "./styles"
import useMatchLogic from "./useMatchLogic"

type ScreenProps = StackScreenParams<"match">
type RouteProps = RootRouteProps<"match">

const carImage = require("../../assets/images/car.png")
const carRobotImage = require("../../assets/images/car-robot.png")
const flagImage = require("../../assets/images/flag.png")

function Match(): JSX.Element {
  const { styles } = useStyles()
  const { replace } = useNavigation<ScreenProps>()
  const { params } = useRoute<RouteProps>()
  const { width } = useWindowDimensions()
  const { hasOngoingMatch } = useFriendsContext()

  useEffect(() => {
    hasOngoingMatch.current = true

    return () => {
      hasOngoingMatch.current = false
    }
  }, [])

  const {
    isLoading,
    step,
    opponentStep,
    goToNextChallenge,
    isLastStep,
    challengesCount,
    challenge,
    selectedOption,
    setSelectedOption,
    remainingTime,
    match,
  } = useMatchLogic({
    matchKey: params.match_key,
    onFinish: () => {
      replace("match-result", {
        match_key: params.match_key,
        robot_finished: opponentStep == 6,
      })
    },
  })

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      return true
    })

    return () => {
      sub.remove()
    }
  }, [])

  const progress = useMemo(() => {
    if (!challengesCount) return 16

    return 16 + ((width / 2 - 64) / (challengesCount || 1)) * (step - 1)
  }, [width, step, challengesCount])

  const opponentProgress = useMemo(() => {
    if (!challengesCount) return 16

    return 16 + ((width / 2 - 64) / (challengesCount || 1)) * (opponentStep - 1)
  }, [width, opponentStep, challengesCount])

  return (
    <React.Fragment>
      <SafeAreaView style={styles.main}>
        <RenderWhen when={!isLoading}>
          <View style={styles.main}>
            <Animated.View style={styles.heading}>
              <Animated.View
                style={[
                  styles.car,
                  {
                    left: progress,
                  },
                ]}
                layout={LinearTransition}>
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={carImage}
                />
              </Animated.View>

              <Image style={styles.finish} source={flagImage} />

              <Animated.View
                style={[
                  styles.car1,
                  {
                    right: opponentProgress,
                  },
                ]}
                layout={LinearTransition}>
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={match?.is_against_computer ? carRobotImage : carImage}
                />
              </Animated.View>
            </Animated.View>

            <ScrollView contentContainerStyle={styles.body}>
              <Animated.View
                style={{ gap: 16 }}
                key={progress}
                entering={FadeInDown.springify()}>
                {challenge?.riddle?.map((item: any) => (
                  <View key={item.content}>
                    {item.content_type === "text" ? (
                      <Text variant="bodyLarge">{item.content}</Text>
                    ) : item.content_type == "code" ? (
                      <Code language={item.language} code={item.content} />
                    ) : (
                      <Text variant="bodyLarge">Unsupported content type</Text>
                    )}
                  </View>
                ))}
              </Animated.View>

              <Animated.View style={styles.optionContainer}>
                {challenge?.options?.map(({ id, option }, index) => (
                  <Animated.View
                    layout={LinearTransition}
                    entering={FadeInDown.delay((index + 1) * 50).springify()}
                    key={id}>
                    <Option
                      active={selectedOption == id}
                      onPress={() => setSelectedOption(id)}>
                      {option}
                    </Option>
                  </Animated.View>
                ))}
              </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
              <TimerButton
                disabled={!selectedOption}
                duration={MATCH_DURATION}
                initialState={remainingTime}
                key={progress}
                onPress={goToNextChallenge}
                onComplete={goToNextChallenge}>
                {isLastStep ? "Tugatish" : "Keyingisi"}
              </TimerButton>
            </View>
          </View>
        </RenderWhen>
      </SafeAreaView>
      <LoadingOverlay visible={isLoading} />
    </React.Fragment>
  )
}

export default Match
