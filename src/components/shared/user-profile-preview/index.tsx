import { memo } from "react"

import { ActivityIndicator, Platform, View } from "react-native"

import useUserRank from "../../../hooks/queries/user-rank"
import useUserStats from "../../../hooks/queries/user-stats"

import compareProps from "../../../utils/compare-props"
import ContextMenu, { MenuProps } from "../../kit/context-menu"
import StatsBox from "../stats-box"

import useStyles from "./styles"

const UserProfilePreview = ({
  open = false,
  user_id,
  disabled,
  onClose,
  ...props
}: Omit<MenuProps, "preview"> & {
  user_id: number
  disabled?: boolean
  open?: boolean
  onClose?: () => void
}) => {
  if (Platform.OS != "ios" || disabled) {
    return props.children
  }

  const { styles, theme } = useStyles()
  const { data: stats, isLoading: statsloading } = useUserStats(user_id, open)
  const { data: rank, isLoading: rankStatsLoading } = useUserRank(user_id, open)

  return (
    <ContextMenu
      {...props}
      onCancel={onClose}
      preview={
        <View style={styles.main}>
          <View style={styles.top}>{props.children}</View>
          {true ? (
            <View style={styles.body}>
              {statsloading || rankStatsLoading ? (
                <View style={styles.loading}>
                  <ActivityIndicator color={theme.colors.primary} />
                </View>
              ) : null}

              <View style={styles.row}>
                <StatsBox
                  icon="tag"
                  value={rank?.rank || 0}
                  description="- o'rin"
                  style={styles.box}
                />
                <StatsBox
                  icon="scoreboard"
                  value={rank?.score || 0}
                  description="ball"
                  style={styles.box}
                />
              </View>
              <View style={styles.row}>
                <StatsBox
                  icon="swords"
                  value={stats?.summary.matches || 0}
                  description="ta jang"
                  style={styles.box}
                />
                <StatsBox
                  icon="emoji_events"
                  value={Math.round(
                    ((stats?.summary.total_wins || 0) /
                      (stats?.summary.matches || 1)) *
                      100,
                  )}
                  description="% g'alaba"
                  style={styles.box}
                />
              </View>
            </View>
          ) : null}
        </View>
      }
    />
  )
}

export default memo(UserProfilePreview, compareProps(["open", "children"]))
