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
          height: 48,
          alignItems: "center",
          marginVertical: 8,
          paddingHorizontal: 16,
          gap: 12,
          paddingRight: 24,
        },

        content: {
          flex: 1,
          justifyContent: "center",
        },
        user: {},
        subtitle: {
          marginTop: 4,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
