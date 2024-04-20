import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

import { FONT_MEDIUM } from "../../../styles/typography"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          lineHeight: 22,
          fontFamily: FONT_MEDIUM,
          fontSize: 16,
          color: theme.colors.onBackground,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
