import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 16,
          gap: 12,
        },

        content: {
          flex: 1,
          justifyContent: "center",
        },

        button: {
          margin: 0,
        },

        subtitle: {
          marginTop: 4,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
