import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          padding: 12,
          paddingBottom: 104,
        },
        loading: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
