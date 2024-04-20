import { useMemo } from "react"

import { Platform, StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()
  const { width, height } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
        },
        fabContainer: {
          paddingBottom: 0,
        },
        fab: {
          borderRadius: 100,
          backgroundColor: theme.colors.primary,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
