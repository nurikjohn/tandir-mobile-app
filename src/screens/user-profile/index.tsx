import React from "react"

import { useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Platform, View } from "react-native"
import { Text } from "react-native-paper"
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"

import useMyRank from "../../hooks/queries/my-rank"
import useMyStats from "../../hooks/queries/my-stats"
import useProfile from "../../hooks/queries/profile"
import useUserRank from "../../hooks/queries/user-rank"
import useUserStats from "../../hooks/queries/user-stats"

import SafeAreaView from "../../components/kit/safe-area-view"
import ActivityTiles from "../../components/shared/activity-tiles"
import ProfileFooter from "../../components/shared/profile-footer"
import ScreenHeader from "../../components/shared/screen-header"
import StatsBox from "../../components/shared/stats-box"
import { RootRouteProps, StackScreenParams } from "../../navigation"

import useStyles from "./styles"

type ScreenProps = StackScreenParams<"user-profile">
type RouteProps = RootRouteProps<"user-profile">

function UserProfile(): JSX.Element {
  const { styles, theme } = useStyles()
  const scrollY = useSharedValue(0)
  const { goBack } = useNavigation<ScreenProps>()
  const { params } = useRoute<RouteProps>()
  const { data: stats, isLoading: statsLoading } = useUserStats(params.user_id)
  const { data: rank, isLoading: rankLoading } = useUserRank(params.user_id)

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  return (
    <SafeAreaView style={styles.main} edges={["top"]}>
      <ScreenHeader
        action={() => goBack()}
        actionIcon="arrow_back"
        title=""
        scrollY={scrollY}
      />

      {statsLoading || rankLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 72,
          }}>
          <ActivityIndicator
            size={Platform.select({ android: "large", default: "small" })}
            color={theme.colors.primary}
          />
        </View>
      ) : (
        <Animated.ScrollView
          contentContainerStyle={styles.body}
          onScroll={scrollHandler}>
          <Text variant="headlineMedium" style={styles.name}>
            {`${params?.first_name}\n${params?.last_name ?? ""}`}
          </Text>
          <View style={styles.row}>
            <StatsBox
              icon="tag"
              value={rank?.rank || 0}
              description="- o'rin"
            />
            <StatsBox
              icon="scoreboard"
              value={rank?.score || 0}
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
          <ProfileFooter date={params?.date_joined || 0} />
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  )
}

export default UserProfile
