import { useMemo } from "react"

import { Platform, StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

import { FONT_MEDIUM } from "../../styles/typography"

const useStyles = ({ socketConnected }: { socketConnected: boolean }) => {
  const theme = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        heading: {
          paddingHorizontal: 16,
          paddingVertical: 16,
          paddingBottom: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        saveButton: {
          margin: 0,
        },
        body: {
          flex: 1,
        },
        title: {
          backgroundColor: theme.colors.background,
          paddingVertical: 4,
        },
        underline: {
          marginLeft: 16,
          height: 1,
          transform: [
            {
              scaleY: 2.5,
            },
          ],
        },
        divider: {
          height: 2,
          backgroundColor: theme.colors.surface,
        },
        listItem: {
          paddingVertical: 8,
          backgroundColor: theme.colors.background,
        },
        listTitle: {
          fontFamily: FONT_MEDIUM,
        },
        logoutTitle: {
          color: theme.colors.error,
        },
        versionContainer: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        version: {
          marginTop: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          justifyContent: "center",
          marginBottom: 8,
        },
        versionText: {
          color: theme.colors.onSurfaceDisabled,
        },
        input: {
          color: theme.colors.onSurface,
        },
        socketIndicator: {
          width: 8,
          height: 8,
          backgroundColor: socketConnected ? "green" : "red",
          borderRadius: 8,
        },
      }),
    [socketConnected],
  )

  return { styles, theme }
}

export default useStyles
