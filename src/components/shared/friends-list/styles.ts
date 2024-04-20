import { useMemo } from "react"

import { Platform, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          paddingBottom: 104,
        },
        listFooterHint: {
          gap: 12,
          flexDirection: "row",
        },
        listFooterHintDesc: {
          fontSize: 14,
          lineHeight: 16,
          color: theme.colors.onSurfaceVariant,
        },
        listFooter: {
          marginTop: 16,
          color: theme.colors.onSurfaceVariant,
          lineHeight: 24,
          fontSize: 14,
          textAlign: "center",
        },
        textIconContainer: {
          width: 28,
          height: 28,
          backgroundColor: theme.colors.primary,
          padding: 4,
          borderRadius: 100,
          transform: [
            {
              translateY: Platform.select({
                ios: 4,
                android: 10,
                default: 4,
              }),
            },
          ],
        },
        textIcon: {
          transform: [
            {
              translateY: 2,
            },
          ],
          paddingHorizontal: 1,
          color: theme.colors.onPrimary,
        },
        button: {
          margin: 0,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
