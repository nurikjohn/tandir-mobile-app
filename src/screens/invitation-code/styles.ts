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
        },
        heading: {
          paddingHorizontal: 16,
          paddingVertical: 16,
        },
        body: {
          flex: 1,
          paddingHorizontal: 16,
          gap: 16,
          alignItems: "center",
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
        hint: {
          width: "100%",
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
