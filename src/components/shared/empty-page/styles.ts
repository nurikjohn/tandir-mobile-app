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
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: 32,
          gap: 48,
          paddingBottom: 120,
        },
        content: {
          paddingHorizontal: 32,
          gap: 8,
          alignItems: "center",
        },
        title: { textAlign: "center" },
        description: {
          textAlign: "center",
          color: theme.colors.onSurfaceVariant,
        },
        animation: {
          width: width / 2,
          height: width / 2,
        },
      }),
    [width],
  )

  return { styles, theme }
}

export default useStyles
