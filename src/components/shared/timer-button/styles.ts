import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {},
        progress: {
          position: "absolute",
          height: "100%",
          opacity: 0.3,
          backgroundColor: theme.colors.primary,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
