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
        main: {
          paddingBottom: bottom + 32,
        },
        listItem: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 16,
          paddingRight: 24,
          gap: 12,
        },

        content: {
          flex: 1,
          justifyContent: "center",
        },

        button: {
          margin: 0,
        },

        image: {
          width: 56,
          height: 56,
          borderRadius: 100,
        },

        title: {},
        subtitle: {
          marginTop: 2,
          opacity: 0.5,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
