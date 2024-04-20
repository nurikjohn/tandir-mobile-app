import { useMemo } from "react"

import { Platform, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { FONT_BOLD } from "../../styles/typography"

const useStyles = () => {
  const theme = useTheme()
  const { bottom } = useSafeAreaInsets()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        listHeadeContent: {
          paddingHorizontal: 32,
          padding: 16,
        },
        listHeaderTitle: {
          textAlign: "center",
          color: theme.colors.onPrimary,
          fontWeight: Platform.select({
            ios: "700",
            android: "600",
            default: "600",
          }),
          fontFamily: FONT_BOLD,
          lineHeight: 28,
        },
        listHeaderDescription: {
          marginTop: 8,
          textAlign: "center",
          color: theme.colors.onPrimary,
          fontWeight: "500",
        },
        backContainer: {
          position: "absolute",
          padding: 16,
          left: 0,
          bottom: bottom + 0,
          zIndex: 10,
        },
        back: {
          borderRadius: 100,
          backgroundColor: theme.colors.surface,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
