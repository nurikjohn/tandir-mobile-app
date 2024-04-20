import { useMemo } from "react"

import { StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 72,
        },
        animation: {
          width: width / 2,
          height: width / 2,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
