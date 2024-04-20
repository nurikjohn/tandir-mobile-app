import { useMemo } from "react"

import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = () => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          width: "100%",
        },
        row: {
          flexDirection: "row",
          gap: 16,
        },

        left: {
          alignItems: "flex-end",
          flex: 1,
        },
        right: {
          alignItems: "flex-start",
          flex: 1,
        },

        disabled: {
          opacity: 0.3,
        },

        leftUserName: {
          textAlign: "right",
          lineHeight: 22,
        },

        rigthUserName: {
          textAlign: "left",
          lineHeight: 22,
        },

        icon: {
          marginTop: 6,
        },

        rankRow: {
          flexDirection: "row",
          gap: 56,
          marginTop: 8,
        },
      }),
    [],
  )

  return { styles, theme }
}

export default useStyles
