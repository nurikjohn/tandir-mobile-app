import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sheetBackground: {
          backgroundColor: theme.colors.background,
        },
        body: {
          paddingTop: 8,
          paddingBottom: 72,
          paddingHorizontal: 8,
          gap: 8,
        },
        itemContainer: {
          borderWidth: 2,
          borderColor: theme.colors.surface,
          flexDirection: "row",
        },
        leftContainer: {
          padding: 8,
          borderRightWidth: 2,
          borderColor: theme.colors.surface,
          width: 72,
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        },
        status: {
          lineHeight: 24,
          paddingHorizontal: 4,
        },
        rightContainer: {
          padding: 8,
          flex: 1,
          gap: 8,
        },
        timeContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
        },
        time: {
          color: theme.colors.onSurfaceVariant,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
