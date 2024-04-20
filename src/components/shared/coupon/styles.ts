import { useMemo } from "react"

import { Platform, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

import {
  FONT_BOLD,
  FONT_MEDIUM,
  FONT_ULTRABOLD,
} from "../../../styles/typography"

const BORDER_WIDTH = 3

const useStyles = ({ inactive }: { inactive: boolean }) => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          position: "relative",
          overflow: "hidden",
          backgroundColor: inactive
            ? theme.colors.surface
            : theme.colors.primary,
        },
        content: {
          flexDirection: "row",
          padding: 24,
        },
        dashContainer: {
          borderColor: theme.colors.onPrimary,
          borderTopWidth: BORDER_WIDTH,
          borderBottomWidth: BORDER_WIDTH,
          width: 24,
          height: 112,
        },
        dash: {
          width: 24,
          height: 110,
          marginTop: -2,
        },
        codeContainer: {
          borderWidth: BORDER_WIDTH,
          borderColor: theme.colors.onPrimary,
          position: "relative",
          width: 48,
        },
        code: {
          top: 0,
          width: 80,
          textAlign: "center",
          position: "absolute",
          transform: [
            {
              rotateZ: "-90deg",
            },
            {
              translateX: -42,
            },
            {
              translateY: -20,
            },
          ],
          color: theme.colors.onPrimary,
          fontSize: 16,
          fontFamily: FONT_BOLD,
          fontWeight: Platform.select({
            ios: "800",
            android: "600",
            default: "600",
          }),
          lineHeight: 22,
        },

        couponTitleContainer: {
          borderWidth: BORDER_WIDTH,
          borderColor: theme.colors.onPrimary,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          flex: 1,
          height: 112,
          borderStyle: inactive ? "dashed" : "solid",
        },
        couponTitle: {
          textAlign: "center",
          color: theme.colors.onPrimary,
          fontSize: inactive ? 24 : 32,
          lineHeight: inactive ? 36 : 40,
          fontFamily: FONT_ULTRABOLD,
          fontWeight: Platform.select({
            ios: "600",
            android: "600",
            default: "600",
          }),
          marginTop: 4,
        },
      }),
    [inactive],
  )

  return { styles, theme }
}

export default useStyles
