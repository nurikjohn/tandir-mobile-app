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
        heading: {
          paddingHorizontal: 16,
          paddingTop: 8,
          borderBottomWidth: 2,
          borderColor: theme.colors.surface,
          flexDirection: "row",
          justifyContent: "center",
        },

        finish: {
          width: 28,
          height: 28,
        },

        car: {
          bottom: -1,
          position: "absolute",
          transform: [{ rotateY: "180deg" }],
          justifyContent: "flex-end",
        },

        car1: {
          bottom: -1,
          position: "absolute",
        },

        image: {
          width: 32,
          height: 18,
        },

        body: {
          gap: 16,
          paddingTop: 24,
          paddingHorizontal: 16,
          paddingBottom: 32,
        },

        footer: {
          borderTopWidth: 2,
          borderColor: theme.colors.surface,
          paddingHorizontal: 16,
          paddingVertical: 16,
        },
        optionContainer: { gap: 8, marginTop: 24 },
        option: {
          height: 40,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
