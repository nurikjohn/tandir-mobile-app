import { useMemo } from "react"

import { StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          borderRadius: 96,
          backgroundColor: theme.colors.surface,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
          padding: 16,
          flexDirection: "row",
        },
        animation: {
          width: 72,
          height: 72,
        },
        bubble2: {
          width: 24,
          height: 24,
          borderRadius: 24,
          backgroundColor: theme.colors.surface,
          position: "absolute",
          left: 24,
          top: -8,
        },
        bubble2Left: {
          width: 24,
          height: 24,
          borderRadius: 24,
          backgroundColor: theme.colors.surface,
          position: "absolute",
          right: 24,
          top: -8,
        },
        bubble1: {
          width: 8,
          height: 8,
          borderRadius: 8,
          backgroundColor: theme.colors.surface,
          position: "absolute",
          left: 24,
          top: -16,
        },
        bubble1Left: {
          width: 8,
          height: 8,
          borderRadius: 8,
          backgroundColor: theme.colors.surface,
          position: "absolute",
          right: 24,
          top: -16,
        },
        reaction: {
          borderRadius: 100,
          overflow: "hidden",
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
