import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const useStyles = () => {
  const theme = useTheme()
  const { bottom } = useSafeAreaInsets()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        itemContainer: {
          // borderColor: theme.colors.backdrop,
        },
        columnWrapper: {
          gap: 16,
        },
        contentContainer: {
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: bottom + 8,
          gap: 16,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
