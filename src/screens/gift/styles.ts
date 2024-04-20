import { useMemo } from "react"

import { Platform, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const CIRCLE_LENGTH = (25 * Math.PI) / 2

const useStyles = () => {
  const theme = useTheme()
  const { bottom, top } = useSafeAreaInsets()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginTop: Platform.select({
            ios: top - CIRCLE_LENGTH + 8,
            default: top - CIRCLE_LENGTH + 24,
          }),
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
      }),

    [top, bottom],
  )

  return { styles, theme }
}

export default useStyles
