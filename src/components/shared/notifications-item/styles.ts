import { useMemo } from "react"

import Color from "color"
import { StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = ({ active }: { active: boolean }) => {
  const theme = useTheme()
  const PADDING = 12
  const BORDER_WIDTH = 2
  const { width } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          borderWidth: BORDER_WIDTH,
          borderColor: active
            ? Color.rgb(theme.colors.primary).alpha(0.3).string()
            : theme.colors.surface,
          padding: PADDING,
          gap: 8,
        },

        header: {
          flexDirection: "row",
          gap: 16,
        },

        title: {
          flex: 1,
        },

        description: {
          color: theme.colors.onSurfaceVariant,
          lineHeight: 18,
        },

        image: {
          width: width - PADDING * 4 - BORDER_WIDTH * 2,
          aspectRatio: 16 / 9,
        },
      }),
    [width, active],
  )

  return { styles, theme }
}

export default useStyles
