import { useMemo } from "react"

import { Dimensions, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const WIDTH = Dimensions.get("window").width

const ROW_LENGTH = 7
const TILE_SIZE = Math.floor((WIDTH - 24 - 6 * 6 - 4 - 32) / 7)

const useStyles = ({
  index,
  shown,
  active,
}: {
  active: boolean
  shown: boolean
  index: number
}) => {
  const theme = useTheme()

  const { popoverStyle, pointerStyle } = useMemo(() => {
    let popoverStyle: any = {}
    let pointerStyle: any = {}
    const i = index % ROW_LENGTH

    if (i > 1 && i < ROW_LENGTH - 2) {
      popoverStyle = {
        left: -100 + TILE_SIZE / 2,
        alignItems: "center",
      }

      pointerStyle = {
        left: 0,
      }
    } else if (i == ROW_LENGTH - 2) {
      popoverStyle = {
        right: -TILE_SIZE - 18,
        alignItems: "flex-end",
      }
      pointerStyle = {
        right: TILE_SIZE * 1.5 + 10,
      }
    } else if (i == ROW_LENGTH - 1) {
      popoverStyle = {
        right: -12,
        alignItems: "flex-end",
      }
      pointerStyle = {
        right: TILE_SIZE / 2 + 4,
      }
    } else if (i == 1) {
      popoverStyle = {
        left: -TILE_SIZE - 18,
        alignItems: "flex-start",
      }
      pointerStyle = {
        left: TILE_SIZE * 1.5 + 10,
      }
    } else if (i == 0) {
      popoverStyle = {
        left: -12,
        alignItems: "flex-start",
      }
      pointerStyle = {
        left: TILE_SIZE / 2 + 4,
      }
    }

    return {
      popoverStyle,
      pointerStyle,
    }
  }, [index, ROW_LENGTH])

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          position: "relative",
          width: TILE_SIZE,
          height: TILE_SIZE,
          opacity: shown ? 1 : 0,
        },
        popoverContainer: {
          position: "absolute",
          top: -32,
          width: 200,
          ...popoverStyle,
        },
        popover: {
          padding: 4,
          paddingHorizontal: 8,
          zIndex: 1000,
          backgroundColor: theme.colors.primary,
        },
        popoverText: {
          color: theme.colors.onPrimary,
        },
        popoverPointer: {
          zIndex: 999,
          width: 16,
          height: 16,
          backgroundColor: theme.colors.primary,
          transform: [
            {
              rotate: "45deg",
            },
          ],
          top: -Math.sqrt(2) * 8,
          ...pointerStyle,
        },
        cell: {
          flex: 1,
          backgroundColor: theme.colors.surface,
          borderRadius: 1000,
          borderColor: theme.colors.primary,
          borderWidth: active ? 2 : 0,
          overflow: "hidden",
        },
        cellContent: {
          borderRadius: 1000,
          backgroundColor: theme.colors.primary,
          width: "100%",
          height: "100%",
        },
        weekdayName: {
          flex: 1,
          alignItems: "center",
        },
        weekdayNameText: {
          color: theme.colors.onSurfaceVariant,
        },
      }),
    [shown, popoverStyle, pointerStyle, active],
  )

  return { styles, theme }
}

export default useStyles
