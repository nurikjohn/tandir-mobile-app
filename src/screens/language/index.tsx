import React, { useEffect, useState } from "react"

import { SafeAreaView, View } from "react-native"
import { Divider, Text } from "react-native-paper"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"

import usePreferencesMutation from "../../hooks/mutations/preferences"
import useLanguages from "../../hooks/queries/languages"
import useLeaderboard from "../../hooks/queries/leaderboard"
import usePreferences from "../../hooks/queries/preferences"

import Button from "../../components/kit/button"
import LanguageCard from "../../components/shared/language-card"
import LoadingOverlay from "../../components/shared/loading-overlay"

import useStyles from "./styles"

function Language(): JSX.Element {
  // PREFETCH
  useLeaderboard()

  const { styles, theme } = useStyles()
  const scrollY = useSharedValue(0)

  const [selectedItemId, setSelectedItemId] = useState<number>()
  const { data: languages } = useLanguages()
  const { data: profile } = usePreferences()

  const preferences = usePreferencesMutation()

  useEffect(() => {
    if (profile?.primary_topic) setSelectedItemId(profile.primary_topic.id)
  }, [profile])

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const dividerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 72], [0, 1], Extrapolation.CLAMP),
    }
  })

  const saveLanugage = () => {
    preferences
      .mutateAsync({
        primary_topic: selectedItemId,
      })
      .catch()
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.heading}>
        <Text variant="headlineMedium">Qurolingizni{"\n"}tanlang</Text>
      </View>

      <Animated.View style={dividerStyle}>
        <Divider
          style={{
            height: 2,
            backgroundColor: theme.colors.surface,
          }}
        />
      </Animated.View>

      <Animated.FlatList
        contentContainerStyle={styles.body}
        data={languages || []}
        renderItem={({ item, index }) => {
          return (
            <LanguageCard
              row={Math.floor(index / 2) + 1}
              data={item}
              active={item.id == selectedItemId}
              onPress={() => setSelectedItemId(item.id)}
            />
          )
        }}
        columnWrapperStyle={styles.listGap}
        numColumns={2}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Button
          disabled={!selectedItemId || preferences.isLoading}
          onPress={saveLanugage}
          right={"arrow_forward"}>
          Davom etish
        </Button>
      </View>
      <LoadingOverlay visible={preferences.isLoading} />
    </SafeAreaView>
  )
}

export default Language
