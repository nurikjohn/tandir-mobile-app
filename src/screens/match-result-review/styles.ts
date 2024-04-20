import { useMemo } from "react"

import { Platform, StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          gap: 16,
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: 32,
        },
        divider: {
          height: 2,
          backgroundColor: theme.colors.surface,
        },
      }),
    [width],
  )

  return { styles, theme }
}

export default useStyles
