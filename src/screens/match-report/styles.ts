import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
          gap: 16,
          paddingTop: 16,
        },

        radio: {
          borderWidth: 2,
          borderColor: theme.colors.surface,
          width: 32,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
        },

        radioActive: {
          borderColor: theme.colors.primary,
        },

        radioGroup: {},

        radioItem: {
          gap: 8,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 8,
        },

        footer: {
          borderTopWidth: 2,
          borderColor: theme.colors.surface,
          paddingHorizontal: 16,
          paddingVertical: 16,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
