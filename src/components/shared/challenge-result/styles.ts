import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          gap: 24,
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
