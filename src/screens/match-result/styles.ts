import { useMemo } from "react"

import { Platform, StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        appbar: {
          marginTop: Platform.select({
            android: 8,
            ios: 0,
          }),
          backgroundColor: "transparent",
          justifyContent: "center",
        },
        body: {
          paddingTop: 16,
          paddingBottom: 24,
          flex: 1,
        },

        footer: {
          borderTopWidth: 2,
          borderColor: theme.colors.surface,
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: theme.colors.background,
          flexDirection: "row",
          gap: 8,
        },

        reviewIcon: {
          margin: 0,
          borderWidth: 2,
          borderColor: theme.colors.primary,
          borderRadius: 0,
          height: 56,
          width: 56,
        },

        loading: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        loadingLabel: {
          marginTop: 16,
          opacity: 0.5,
        },

        scoreChangeContainer: {
          flexDirection: "row",
          paddingHorizontal: 24,
          marginBottom: 16,
          minHeight: 48,
          zIndex: 100,
        },
        scoreChangeAmount: {
          width: 48,
          borderWidth: 2,
          borderColor: theme.colors.surface,
          justifyContent: "center",
          alignItems: "center",
          borderRightWidth: 0,
          backgroundColor: theme.colors.background,
        },
        scoreChangeDescription: {
          borderWidth: 2,
          borderColor: theme.colors.surface,
          padding: 8,
          paddingHorizontal: 12,
          flex: 1,
          justifyContent: "center",
          backgroundColor: theme.colors.background,
        },
        resultAnimation: {
          width: (width / 3) * 2,
          height: (width / 3) * 2,
          position: "absolute",
          left: -(width / 3),
          top: -(width / 3) + 24,
        },
      }),
    [width],
  )

  return { styles, theme }
}

export default useStyles
