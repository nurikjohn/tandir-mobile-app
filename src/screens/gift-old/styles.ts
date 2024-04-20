import { useMemo } from "react"

import { Platform, StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { FONT_BOLD } from "../../styles/typography"

const useStyles = () => {
  const theme = useTheme()
  const { bottom } = useSafeAreaInsets()
  const { height } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
        },
        heading: {
          paddingHorizontal: 8,
          paddingVertical: 8,
        },
        headerBackground: {
          height: height * 1.5,
          backgroundColor: theme.colors.primary,
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
        },
        extraBackground: {
          height: 300,
          backgroundColor: theme.colors.primary,
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          marginHorizontal: 16,
        },
        listHeader: {
          position: "relative",
        },
        listHeadeContent: {
          backgroundColor: theme.colors.primary,
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
          marginTop: 16,
          textAlign: "center",
          color: theme.colors.onPrimary,
          fontWeight: "500",
        },
        body: {
          paddingHorizontal: 16,
          zIndex: 100,
          // transform: [
          //   {
          //     translateY: -50,
          //   },
          // ],
        },
        card: {
          paddingTop: 24,
          backgroundColor: "#000000",
          paddingBottom: bottom + 120,
          minHeight: height,
        },
        giftContainer: {
          position: "absolute",
          padding: 16,
          right: 0,
          bottom: bottom + 0,
          zIndex: 110,
        },
        gift: {
          borderRadius: 100,
          backgroundColor: theme.colors.primary,
        },
        backContainer: {
          position: "absolute",
          padding: 16,
          left: 0,
          bottom: bottom + 0,
          zIndex: 110,
        },
        back: {
          borderRadius: 100,
          backgroundColor: theme.colors.surface,
        },
        currentCouponContainer: {
          position: "absolute",
          width: "100%",
          padding: 16,
          top: "-200%",
          backgroundColor: "#000000",
        },
      }),
    [bottom],
  )

  return { styles, theme }
}

export default useStyles
