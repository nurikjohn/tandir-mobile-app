import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

import { FONT_BOLD_ITALIC } from "../../../styles/typography"

type Params = {
  active?: boolean
  size: number
  order: number
}

const useStyles = ({ active, size, order }: Params) => {
  const theme = useTheme()

  const fontSize = useMemo(() => {
    if (order > 10000) {
      return size / 5
    }

    if (order > 1000) {
      return size / 4
    }

    if (order > 100) {
      return size / 3
    }

    return size / 2.5
  }, [order, size])

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          width: size,
          height: size,
          borderWidth: active ? 2 : 0,
          borderColor: theme.colors.primary,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: size / 2,
          backgroundColor: theme.colors.surface,
          overflow: "hidden",
        },
        text: {
          fontSize,
          fontFamily: FONT_BOLD_ITALIC,
          color: active ? theme.colors.primary : theme.colors.onSurface,
          fontWeight: "600",
          lineHeight: fontSize + 24,
        },
        animation: {
          marginTop: size > 64 ? -8 : -6,
          width: size,
          height: size,
          zIndex: 10,
        },
      }),
    [active, fontSize],
  )

  return { styles, theme }
}

export default useStyles
