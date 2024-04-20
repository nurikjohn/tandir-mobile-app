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
        body: {
          paddingTop: 16,
          paddingBottom: 24,
          paddingHorizontal: 16,
          gap: 8,
        },
        settingsButton: {
          margin: 0,
        },
        row: {
          flexDirection: "row",
          gap: 8,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
