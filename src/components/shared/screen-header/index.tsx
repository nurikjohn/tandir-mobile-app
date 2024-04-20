import React, { memo } from "react"

import { TextStyle, View, ViewStyle } from "react-native"
import { Divider, IconButton, Text } from "react-native-paper"
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated"

import compareProps from "../../../utils/compare-props"
import MaterialSymbols, { IconName } from "../../kit/material-symbols"

import useStyles from "./styles"

interface Props {
  title: string
  scrollY?: SharedValue<number>
  showDivider?: boolean
  children?: React.ReactNode
  style?: ViewStyle
  titleStyle?: TextStyle
  actionIcon?: IconName
  action?: () => void
  shift?: number
}

function ScreenHeader({
  title,
  scrollY,
  showDivider = true,
  children,
  style,
  titleStyle,
  actionIcon,
  action,
  shift,
}: Props): JSX.Element {
  const { styles, theme } = useStyles({ action: !!(action && actionIcon) })

  const dividerStyle = useAnimatedStyle(() => {
    if (!scrollY) return { opacity: 1 }

    return {
      opacity: interpolate(scrollY.value, [0, 72], [0, 1], Extrapolation.CLAMP),
    }
  })

  return (
    <>
      <View style={[styles.heading]}>
        <View
          style={[
            {
              flexDirection: "row",
              gap: 8,
              flex: 1,
            },
            style,
          ]}>
          {action && actionIcon ? (
            <IconButton
              icon={({ color }) => (
                <MaterialSymbols
                  color={color}
                  name={actionIcon}
                  shift={shift}
                />
              )}
              onPress={action}
              style={{ margin: 0 }}
            />
          ) : null}

          <Text variant="headlineMedium" numberOfLines={2} style={[titleStyle]}>
            {title}
          </Text>
        </View>

        {children}
      </View>

      {showDivider ? (
        <Animated.View style={dividerStyle}>
          <Divider style={styles.divider} />
        </Animated.View>
      ) : null}
    </>
  )
}

export default memo(
  ScreenHeader,
  compareProps(["title", "children", "style", "actionIcon", "action"]),
)
