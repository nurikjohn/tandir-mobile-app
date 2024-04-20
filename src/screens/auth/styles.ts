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
          padding: 16,
        },
        animationContainer: {
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 100,
        },
        animation: {
          width: "100%",
          height: "100%",
        },
        body: {
          flex: 1,
          justifyContent: "center",
          marginBottom: 40,
        },
        backgroundImage: {
          height: "100%",
          width: "100%",
        },
        footer: {
          gap: 16,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
