import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          justifyContent: "space-between",
          flexDirection: "row",
        },
        signature: {
          borderWidth: 2,
          borderColor: theme.colors.surface,
          padding: 8,
          borderRightWidth: 0,
        },
        text: {
          lineHeight: 16,
          color: theme.colors.surface,
        },
        egg: {
          aspectRatio: 1,
          borderWidth: 2,
          borderColor: theme.colors.surface,
          alignItems: "center",
          justifyContent: "center",
        },
        date: {
          borderWidth: 2,
          borderColor: theme.colors.surface,
          padding: 8,
          borderLeftWidth: 0,
        },
        logo: {
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: theme.colors.surface,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
