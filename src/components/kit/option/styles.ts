import { useMemo } from "react"

import { ColorValue, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = ({
  disabled,
  active,
  color,
}: {
  disabled?: boolean
  active?: boolean
  color?: ColorValue
}) => {
  const theme = useTheme()

  let _color = color ?? theme.colors.surface

  if (active) _color = theme.colors.primary
  else if (disabled) _color = theme.colors.surface

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flexDirection: "row",
          borderWidth: 2,
          paddingHorizontal: 16,
          borderColor: _color,
          alignItems: "center",
          paddingVertical: 16,
        },
        title: {
          color: disabled ? theme.colors.surface : theme.colors.onSurface,
        },
      }),
    [disabled, _color],
  )

  return { styles, theme }
}

export default useStyles
