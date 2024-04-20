import { memo } from "react"

import { Platform, View } from "react-native"
import DeviceInfo from "react-native-device-info"
import { Text, useTheme } from "react-native-paper"
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated"

import useAppState from "../../../hooks/utils/useAppState"

import { FONT_REGULAR } from "../../../styles/typography"
import compareProps from "../../../utils/compare-props"
import MaterialSymbols from "../material-symbols"

const Notch = () => {
  if (Platform.OS != "ios") return null

  const theme = useTheme()
  const { isActive } = useAppState()
  const hasNotch = DeviceInfo.hasNotch()
  const hasDynamicIsland = DeviceInfo.hasDynamicIsland()

  if ((hasNotch || hasDynamicIsland) && isActive) {
    return (
      <Animated.View
        entering={ZoomIn.delay(100)}
        exiting={FadeOut}
        style={{
          width: "100%",
          top: hasDynamicIsland ? 16 : 6,
          zIndex: 1000,
          position: "absolute",
          alignItems: "center",
        }}>
        <View
          style={{
            backgroundColor: theme.colors.primary,
            padding: 2,
            paddingHorizontal: 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            justifyContent: "center",
            borderRadius: 50,
            paddingRight: 8,
          }}>
          <MaterialSymbols
            name="flash_on"
            color={theme.colors.onPrimary}
            shift={0}
            size={16}
          />
          <Text
            style={{
              color: theme.colors.onPrimary,
              fontFamily: FONT_REGULAR,
              fontWeight: "500",
              fontSize: 14,
              marginTop: -1,
            }}>
            Tandir
          </Text>
        </View>
      </Animated.View>
    )
  }

  return null
}

export default memo(Notch, compareProps([]))
