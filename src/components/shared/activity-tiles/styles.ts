import { useMemo } from "react"

import { Dimensions, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const WIDTH = Dimensions.get("window").width

const TILE_SIZE = Math.floor((WIDTH - 24 - 6 * 6 - 4 - 32) / 7)

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
          borderWidth: 2,
          borderColor: theme.colors.surface,
          padding: 12,
          gap: 6,
        },
        row: {
          flexDirection: "row",
          gap: 6,
          flex: 1,
          flexWrap: "wrap",
          justifyContent: "space-between",
        },
        tilesContainer: {
          height: TILE_SIZE * 4 + 3 * 6,
        },
        weekdayName: {
          width: TILE_SIZE,
          alignItems: "center",
        },
        weekdayNameText: {
          color: theme.colors.onSurfaceVariant,
        },
        loading: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 24,
        },
      }),
    [],
  )

  return { styles, theme, itemSize: TILE_SIZE }
}

export default useStyles
