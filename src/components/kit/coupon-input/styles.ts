import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

import { FONT_BOLD } from "../../../styles/typography"

const useStyles = ({
  focused,
  error,
}: {
  focused?: boolean
  error: boolean
}) => {
  const theme = useTheme()

  const borderColor = error
    ? theme.colors.error
    : focused
    ? theme.colors.onBackground
    : theme.colors.surface

  const color = error ? theme.colors.error : theme.colors.onBackground

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          padding: 24,
          borderColor,
          borderWidth: 2,
          fontSize: 20,
          textAlign: "center",
          width: "69%",
          maxWidth: 300,
          fontFamily: FONT_BOLD,
          letterSpacing: 10,
          color,
          textTransform: "uppercase",
        },
        errorText: {
          textAlign: "center",
          paddingHorizontal: 32,
          color: theme.colors.error,
        },
      }),
    [borderColor],
  )

  return { styles, theme }
}

export default useStyles
