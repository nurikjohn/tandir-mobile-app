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
          borderWidth: 2,
          borderColor: theme.colors.surface,
          padding: 12,
          flexDirection: "row",
          gap: 8,
        },
        content: {
          paddingTop: 4,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
