import { Platform } from "react-native"

// FONT FAMILY
export const FONT_REGULAR = "SpaceMono-Regular"
export const FONT_MEDIUM = "SpaceMono-Regular"
export const FONT_BOLD = "SpaceMono-Bold"
export const FONT_ULTRABOLD = "SpaceMono-Bold"
export const FONT_BOLD_ITALIC = "SpaceMono-BoldItalic"

export const fontConfig = {
  displaySmall: {
    fontFamily: FONT_MEDIUM,
    fontSize: 36,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 44,
  },
  displayMedium: {
    fontFamily: FONT_MEDIUM,
    fontSize: 45,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 52,
  },
  displayLarge: {
    fontFamily: FONT_MEDIUM,
    fontSize: 57,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 64,
  },
  headlineSmall: {
    fontFamily: FONT_MEDIUM,
    fontSize: 24,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 32,
  },
  headlineMedium: {
    fontFamily: FONT_ULTRABOLD,
    fontSize: 28,
    fontWeight: Platform.select({
      ios: "800",
      android: "600",
      default: "600",
    }),
    letterSpacing: 0,
    lineHeight: 32,
  },
  headlineLarge: {
    fontFamily: FONT_BOLD,
    fontSize: 32,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 40,
  },
  titleSmall: {
    fontFamily: FONT_BOLD,
    fontSize: 14,
    fontWeight: Platform.select({
      ios: "700",
      android: "500",
      default: "500",
    }),
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  titleMedium: {
    fontFamily: FONT_REGULAR,
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0.15,
    lineHeight: 20,
  },
  titleLarge: {
    fontFamily: FONT_MEDIUM,
    fontSize: 22,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 26,
  },
  labelSmall: {
    fontFamily: FONT_BOLD,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
    lineHeight: 15,
  },
  labelMedium: {
    fontFamily: FONT_MEDIUM,
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: FONT_MEDIUM,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  bodySmall: {
    fontFamily: FONT_MEDIUM,
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  bodyMedium: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.25,
    lineHeight: 18,
  },
  bodyLarge: {
    fontFamily: FONT_MEDIUM,
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0.15,
    lineHeight: 20,
  },
} as const

export default fontConfig
