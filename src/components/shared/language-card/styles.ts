import { useMemo } from "react"

import { StyleSheet, useWindowDimensions } from "react-native"
import { useTheme } from "react-native-paper"

const useStyles = ({
  active,
  inactive,
  progress = 0,
}: {
  inactive?: boolean
  active?: boolean
  progress?: number
}) => {
  const theme = useTheme()
  const { width } = useWindowDimensions()
  const cardWidth = (width - 32 - 16) / 2

  const styles = useMemo(
    () =>
      StyleSheet.create({
        main: {
          borderColor: active
            ? theme.colors.primary
            : theme.colors.surfaceVariant,
          borderWidth: 2,
          width: cardWidth,
          height: cardWidth,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          opacity: inactive ? 0.3 : 1,
        },
        label: {
          marginTop: 24,
        },
        image: {
          width: 72,
          height: 72,
        },
        gradientContainer: {
          width: cardWidth,
          height: cardWidth * (progress / 100),
          position: "absolute",
          zIndex: 100,
          bottom: 0,
          overflow: "hidden",
        },
        gradient: {
          width: cardWidth,
          height: cardWidth,
          position: "absolute",
          bottom: 0,
        },
        progressDivider: {
          backgroundColor: theme.colors.primary,
          height: 2,
        },
      }),
    [active, inactive, progress, theme],
  )

  return { styles, theme }
}

export default useStyles
