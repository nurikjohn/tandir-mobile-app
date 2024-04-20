import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          paddingBottom: 104,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
