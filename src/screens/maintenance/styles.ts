import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
        },
        description: {
          textAlign: "center",
          color: theme.colors.onSurfaceVariant,
        },
        timerBox: {
          padding: 8,
          borderWidth: 2,
          borderColor: theme.colors.surface,
          zIndex: 200,
          backgroundColor: theme.colors.background,
          overflow: "hidden",
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
