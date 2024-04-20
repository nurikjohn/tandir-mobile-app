import color from "color"
import { MD3DarkTheme, MD3Theme, configureFonts } from "react-native-paper"

import { BACKGROUND, DISABLED, ERROR, GRAY, PRIMARY, TEXT } from "./colors"
import fontConfig from "./typography"

const theme: MD3Theme = {
  ...MD3DarkTheme,

  roundness: 0,

  colors: {
    ...MD3DarkTheme.colors,
    primary: PRIMARY,
    primaryContainer: color.rgb(PRIMARY).alpha(0.1).string(),
    surface: GRAY,
    onSurface: TEXT,

    background: BACKGROUND,
    onPrimary: BACKGROUND,
    onSurfaceVariant: DISABLED,
    surfaceVariant: color.rgb(TEXT).alpha(0.05).string(),
    error: ERROR,
    errorContainer: color.rgb(ERROR).alpha(0.1).string(),

    backdrop: color.rgb(BACKGROUND).alpha(0.69).string(),

    elevation: {
      level0: "transparent",
      level1: "transparent",
      level2: "transparent",
      level3: "transparent",
      level4: "transparent",
      level5: "transparent",
    },
  },

  // @ts-expect-error
  fonts: configureFonts({ config: fontConfig }),
}

export default theme
