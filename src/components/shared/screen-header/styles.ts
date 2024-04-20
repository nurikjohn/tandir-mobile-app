import { useMemo } from "react"

import { Platform, StyleSheet } from "react-native"
import { ifIphoneX } from "react-native-iphone-x-helper"
import { useTheme } from "react-native-paper"

const useStyles = ({ action }: { action: boolean }) => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        heading: {
          paddingHorizontal: action ? 8 : 16,
          flexDirection: "row",
          justifyContent: "space-between",

          paddingBottom: 8,
          minHeight: 48,
          paddingTop: Platform.select({
            ios: ifIphoneX(8, 0),
            android: 8,
          }),
        },
        divider: {
          height: 2,
          backgroundColor: theme.colors.surface,
        },
      }),
    [action],
  )

  return { styles, theme }
}

export default useStyles
