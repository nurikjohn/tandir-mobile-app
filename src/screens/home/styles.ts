import { useMemo } from "react"

import { Platform, StyleSheet } from "react-native"
import { ifIphoneX } from "react-native-iphone-x-helper"
import { useTheme } from "react-native-paper"

import { FONT_BOLD } from "../../styles/typography"

const ANIMATION_SIZE = 160

const useStyles = ({ canStartMatch }: { canStartMatch?: boolean }) => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
        },

        body: {
          paddingHorizontal: 16,
          paddingBottom: 104,
        },

        notificationsButton: {
          margin: 0,
        },

        notificationsBadge: {
          position: "absolute",
          top: -4,
          right: -4,
          backgroundColor: theme.colors.primary,
          color: theme.colors.onPrimary,
          fontFamily: FONT_BOLD,
          lineHeight: 19,
        },

        footer: {
          borderTopWidth: 2,
          borderColor: theme.colors.surface,
          paddingHorizontal: 24,
          paddingVertical: 16,
        },

        fabContainer: {
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        },

        fab: {
          borderRadius: 100,
          backgroundColor: canStartMatch
            ? theme.colors.primary
            : theme.colors.surface,
        },

        voltageAnimation: {
          position: "absolute",
          bottom:
            Platform.select({
              ios: ifIphoneX(88, 72),
              default: 56,
            }) +
            16 -
            ANIMATION_SIZE / 2 +
            28,
          right: 16 - ANIMATION_SIZE / 2 + 28,
          width: ANIMATION_SIZE,
          height: ANIMATION_SIZE,
        },
        animation: {
          width: ANIMATION_SIZE,
          height: ANIMATION_SIZE,
        },
      }),
    [canStartMatch],
  )

  return { styles, theme }
}

export default useStyles
