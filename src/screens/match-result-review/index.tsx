import React, { useMemo, useRef, useState } from "react"

import { useNavigation, useRoute } from "@react-navigation/native"
import { FlatList, View, useWindowDimensions } from "react-native"
import { Divider, IconButton, Text } from "react-native-paper"
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeOutDown,
  ZoomIn,
  ZoomOut,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"

import useMatch from "../../hooks/queries/match"
import useMatchResult from "../../hooks/queries/match-result"

import Code from "../../components/kit/code"
import MaterialSymbols from "../../components/kit/material-symbols"
import Option from "../../components/kit/option"
import SafeAreaView from "../../components/kit/safe-area-view"
import ScreenHeader from "../../components/shared/screen-header"
import { RootRouteProps, StackScreenParams } from "../../navigation"

import useStyles from "./styles"

type RouteProps = RootRouteProps<"match-result-review">
type ScreenProps = StackScreenParams<"match">

function MatchResultReview(): JSX.Element {
  const scrollY = useSharedValue(0)

  const listRef = useRef<FlatList>(null)
  const [currentIndex, setIndex] = useState(0)
  const dividerY = useSharedValue(0)
  const optionBottom = useSharedValue(0)
  const scrollViewY = useSharedValue(0)

  const { styles, theme } = useStyles()
  const { goBack, navigate } = useNavigation<ScreenProps>()
  const {
    params: { match_key },
  } = useRoute<RouteProps>()

  const { data: match, isLoading: matchIsLoading } = useMatch(match_key)
  const { data: matchResult, refetch } = useMatchResult(match_key)

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const dividerStyle = useAnimatedStyle(() => {
    const y =
      dividerY.value -
      (scrollViewY.value + optionBottom.value + Math.abs(scrollY.value))

    return {
      opacity: interpolate(y, [48, 0], [0, 1], Extrapolation.CLAMP),
    }
  })

  const challenge = useMemo(() => {
    if (!match) return null

    return match.challenges[currentIndex]
  }, [match, currentIndex])

  const { option, response } = useMemo(() => {
    if (!challenge || !matchResult) return { response: null, option: null }

    const response = matchResult?.your_responses.find(
      (res) => challenge.id === res.challenge_id,
    )

    const option = challenge.options.find(
      ({ id }) => response?.option_id === id,
    )

    return { option, response }
  }, [challenge, matchResult])

  const openReportScreen = () => {
    if (!challenge) return

    navigate("match-report", { match_key, challenge_id: challenge.id })
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScreenHeader
        scrollY={scrollY}
        title={`${currentIndex + 1} - savol`}
        action={() => goBack()}
        actionIcon={"arrow_back"}
        titleStyle={{
          fontSize: 24,
          lineHeight: 38,
          marginLeft: 8,
        }}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        onLayout={({ nativeEvent: { layout } }) => {
          scrollViewY.value = layout.y
        }}
        contentContainerStyle={styles.body}>
        <Animated.View
          style={{ gap: 16 }}
          key={currentIndex}
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

        {option ? (
          <Animated.View
            onLayout={({ nativeEvent: { layout } }) => {
              optionBottom.value = layout.height + layout.y
            }}
            entering={FadeInDown.delay(50).springify()}
            key={option.id}>
            <Option
              textStyle={{
                color: response?.is_correct
                  ? theme.colors.primary
                  : theme.colors.error,
              }}
              color={
                response?.is_correct ? theme.colors.primary : theme.colors.error
              }>
              {option?.option}
            </Option>
          </Animated.View>
        ) : null}
      </Animated.ScrollView>

      <Animated.View
        onLayout={({ nativeEvent: { layout } }) => {
          dividerY.value = layout.y
        }}
        style={dividerStyle}>
        <Divider style={styles.divider} />
      </Animated.View>
      <View
        style={{
          padding: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 16,
        }}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          {currentIndex != 0 ? (
            <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
              <IconButton
                size={72}
                containerColor={theme.colors.surface}
                icon={({ color }) => (
                  <MaterialSymbols
                    name="arrow_back"
                    size={32}
                    shift={-2}
                    color={color}
                  />
                )}
                onPress={() => {
                  setIndex((prev) => {
                    const newIndex = Math.max(prev - 1, 0)
                    listRef.current?.scrollToIndex({
                      index: newIndex,
                      animated: true,
                    })
                    return newIndex
                  })
                }}
                style={{ margin: 0 }}
                disabled={currentIndex == 0}
              />
            </Animated.View>
          ) : null}
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <IconButton
            size={72}
            containerColor={theme.colors.errorContainer}
            icon={({ color }) => (
              <MaterialSymbols
                name="flag"
                size={32}
                shift={-2}
                color={theme.colors.error}
              />
            )}
            style={{ margin: 0 }}
            onPress={openReportScreen}
          />
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {currentIndex < (match?.challenges.length || 5) - 1 ? (
            <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
              <IconButton
                style={{ margin: 0 }}
                size={72}
                containerColor={theme.colors.surface}
                icon={({ color }) => (
                  <MaterialSymbols
                    name="arrow_forward"
                    size={32}
                    shift={-2}
                    color={color}
                  />
                )}
                disabled={currentIndex == (match?.challenges.length || 5) - 1}
                onPress={() => {
                  setIndex((prev) => {
                    const newIndex = Math.min(
                      prev + 1,
                      (match?.challenges.length || 5) - 1,
                    )
                    listRef.current?.scrollToIndex({
                      index: newIndex,
                      animated: true,
                    })
                    return newIndex
                  })
                }}
              />
            </Animated.View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MatchResultReview
