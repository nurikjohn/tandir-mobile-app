import { useMemo } from "react"

import { ColorValue, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = ({
  active,
  disabled,
  color,
}: {
  active?: boolean
  disabled?: boolean
  color?: ColorValue
}) => {
  const theme = useTheme()

  const _color = color ?? theme.colors.surface

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          justifyContent: "center",
          flexDirection: "row",
          borderColor: disabled ? theme.colors.surface : _color,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderWidth: active ? 0 : 2,
          paddingBottom: 6,
          backgroundColor: color
            ? color
            : active
            ? theme.colors.primary
            : theme.colors.background,
        },
        label: {
          color: active
            ? theme.colors.background
            : disabled
            ? theme.colors.surface
            : theme.colors.onSurface,
        },
      }),
    [disabled, _color],
  )

  return { styles, theme }
}

export default useStyles
