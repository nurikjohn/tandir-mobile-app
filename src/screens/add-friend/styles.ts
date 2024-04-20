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
          paddingTop: 24,
        },
        body: {
          flex: 1,
          paddingHorizontal: 16,
          marginTop: 32,
          justifyContent: "space-between",
          paddingBottom: 16,
        },
        footer: {
          borderTopWidth: 2,
          borderColor: theme.colors.surface,
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: "row",
          gap: 8,
        },
        back: {
          borderWidth: 2,
          borderRadius: 0,
          borderColor: theme.colors.onSurfaceVariant,
          width: 56,
          height: 56,
          margin: 0,
        },
        hint: {
          padding: 16,
          borderWidth: 2,
          borderColor: theme.colors.surface,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          gap: 8,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
