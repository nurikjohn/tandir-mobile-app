import { useMemo } from "react"

import { StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = ({ isPenalty }: { isPenalty: boolean }) => {
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
        },
        heading: {
          paddingHorizontal: 24,
          paddingVertical: 16,
          flexDirection: "row",
          justifyContent: "space-between",
        },
        matchContainer: {
          flex: 1,
          gap: 24,
          flexDirection: "column",
          alignItems: "center",
        },
        timerContainer: {
          gap: 8,
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 16,
          width: "100%",
          height: 56,
          alignItems: "flex-end",
        },
        timerBox: {
          padding: 8,
          borderWidth: 2,
          borderColor: theme.colors.surface,
          zIndex: 200,
          backgroundColor: theme.colors.background,
          overflow: "hidden",
        },
        timerText: {
          color: theme.colors.onSurfaceVariant,
          zIndex: 100,
        },

        cooldownContainer: {
          alignItems: "center",
          paddingHorizontal: 40,
          gap: 8,
        },
        cooldownTimer: {
          color: isPenalty ? theme.colors.error : theme.colors.onBackground,
          fontSize: 56,
          lineHeight: 60,
        },
        cooldownDescription: {
          color: isPenalty ? theme.colors.error : theme.colors.onSurfaceVariant,
          textAlign: "center",
        },

        body: {
          flex: 1,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
        },

        loading: {
          width: width - 100,
          height: width - 100,
        },
        robotAnimation: {
          width: 42,
          height: 42,
        },

        footer: {
          borderTopWidth: 2,
          borderColor: theme.colors.surface,
          paddingHorizontal: 24,
          paddingVertical: 16,
        },
        botHintContainer: {
          bottom: "100%",
          position: "absolute",
          flexDirection: "row",
          justifyContent: "center",
          paddingBottom: 16,
        },
        botPressProgress: {
          backgroundColor: theme.colors.primaryContainer,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
        },
      }),
    [width, isPenalty],
  )

  return { styles, theme }
}

export default useStyles
