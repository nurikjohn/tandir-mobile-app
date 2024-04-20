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
          paddingBottom: 8,
        },
        body: {
          paddingVertical: 8,
          paddingHorizontal: 16,
          paddingBottom: 16,
          gap: 16,
        },
        listGap: {
          gap: 16,
        },
        cardLeft: {
          marginRight: 8,
        },
        cardRight: {
          marginLeft: 8,
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
