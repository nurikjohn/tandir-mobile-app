import { useMemo } from "react"

import { ColorValue, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = ({
  disabled,
  color,
}: {
  disabled?: boolean
  color?: ColorValue
}) => {
  const theme = useTheme()

  const _color = color ?? theme.colors.primary

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flexDirection: "row",
          height: 56,
        },
        textContainer: {
          flex: 1,
          borderWidth: 2,
          paddingHorizontal: 16,
          borderColor: disabled ? theme.colors.onSurfaceVariant : _color,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
        },
        title: {
          color: disabled
            ? theme.colors.onSurfaceVariant
            : _color || theme.colors.onSurface,
        },
        iconContainer: {
          width: 56,
          borderWidth: 2,
          borderColor: disabled ? theme.colors.onSurfaceVariant : _color,
          justifyContent: "center",
          alignItems: "center",
        },
        left: {
          borderRightWidth: 0,
        },
        right: {
          borderLeftWidth: 0,
        },
      }),
    [disabled, _color],
  )

  return { styles, theme }
}

export default useStyles
