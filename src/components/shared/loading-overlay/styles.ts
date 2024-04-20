import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          position: "absolute",
          backgroundColor: theme.colors.backdrop,

          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        card: {
          backgroundColor: theme.colors.background,
          borderRadius: 100,
          padding: 16,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
