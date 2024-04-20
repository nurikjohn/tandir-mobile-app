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
          flex: 1,
          backgroundColor: theme.colors.surfaceVariant,
          width: width,
        },
        body: {
          flex: 1,
          padding: 16,
          gap: 8,
        },
        top: {
          paddingVertical: 4,
          borderColor: theme.colors.surfaceVariant,
          borderBottomWidth: 2,
        },

        row: {
          flexDirection: "row",
          gap: 8,
        },
        box: {
          borderColor: theme.colors.surfaceVariant,
        },
        loading: {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: theme.colors.surface,
          zIndex: 1000,
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
