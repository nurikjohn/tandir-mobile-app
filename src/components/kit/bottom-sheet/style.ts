import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()
  const { colors } = theme

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {},

        backdrop: {
          backgroundColor: theme.colors.backdrop,
        },

        background: {
          backgroundColor: theme.colors.surface,
          borderRadius: 0,
        },

        indicator: {
          backgroundColor: theme.colors.primary,
          borderRadius: 0,
          height: 2,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
