import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          gap: 4,
          flexDirection: "row",
        },
        text: {
          lineHeight: 20,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
