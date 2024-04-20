import { useMemo } from "react"

import Color from "color"
import { Platform, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { FONT_BOLD } from "../../../styles/typography"

const useStyles = () => {
  const theme = useTheme()
  const { bottom } = useSafeAreaInsets()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          padding: 24,
          gap: 8,
          paddingBottom: bottom + 16,
        },
        rank: {
          backgroundColor: Color.rgb(theme.colors.primary).alpha(0.1).string(),
          borderColor: theme.colors.primary,
          borderWidth: 4,
        },
        title: {
          marginTop: 24,
          textAlign: "center",
          lineHeight: 24,
        },
        bold: {
          fontFamily: FONT_BOLD,
          fontWeight: Platform.select({
            ios: "800",
            android: "600",
            default: "600",
          }),
          textAlign: "center",
        },
        acceptButton: {
          backgroundColor: theme.colors.primary,
        },
        acceptButtonTitle: {
          color: theme.colors.onPrimary,
          fontWeight: "600",
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
