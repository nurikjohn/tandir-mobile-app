import React, { useEffect } from "react"

import { useNavigation } from "@react-navigation/native"
import { View } from "react-native"
import { IconButton } from "react-native-paper"
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"

import useMyRank from "../../hooks/queries/my-rank"
import useMyStats from "../../hooks/queries/my-stats"
import useProfile from "../../hooks/queries/profile"

import MaterialSymbols from "../../components/kit/material-symbols"
import SafeAreaView from "../../components/kit/safe-area-view"
import ActivityTiles from "../../components/shared/activity-tiles"
import ProfileFooter from "../../components/shared/profile-footer"
import ScreenHeader from "../../components/shared/screen-header"
import StatsBox from "../../components/shared/stats-box"
import { StackScreenParams } from "../../navigation"

import useStyles from "./styles"

type ScreenProps = StackScreenParams<"home">

function Profile(): JSX.Element {
  const { styles, theme } = useStyles()
  const scrollY = useSharedValue(0)
  const { navigate } = useNavigation<ScreenProps>()

  const { data: profile } = useProfile()
  const { data: stats } = useMyStats()
  const { data: rankStats } = useMyRank()

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const openSettings = () => {
    navigate("settings")
  }

  return (
    <SafeAreaView style={styles.main} edges={["top"]}>
      <ScreenHeader
        scrollY={scrollY}
        title={`${profile?.first_name}\n${profile?.last_name}`}>
        <IconButton
          style={styles.settingsButton}
          icon={() => (
            <MaterialSymbols
              color={theme.colors.onBackground}
              name="settings"
              shift={-1}
            />
          )}
          onPress={openSettings}
        />
      </ScreenHeader>

      <Animated.ScrollView
        contentContainerStyle={styles.body}
        onScroll={scrollHandler}>
        <View style={styles.row}>
          <StatsBox
            icon="tag"
            value={rankStats?.rank_number || 0}
            description="- o'rin"
          />
          <StatsBox
            icon="scoreboard"
            value={rankStats?.rank_score || 0}
            description="ball"
          />
        </View>
        <View style={styles.row}>
          <StatsBox
            icon="swords"
            value={stats?.summary.matches || 0}
            description="ta jang"
          />
          <StatsBox
            icon="emoji_events"
            value={Math.round(
              ((stats?.summary.total_wins || 0) /
                (stats?.summary.matches || 1)) *
                100,
            )}
            description="% g'alaba"
          />
        </View>

        <ActivityTiles data={stats?.monthly_activity || []} />
        <ProfileFooter date={profile?.date_joined || 0} />
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

export default Profile
