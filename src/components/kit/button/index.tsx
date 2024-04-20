import { ReactElement, memo, useMemo } from "react"

import Color from "color"
import {
  ColorValue,
  GestureResponderEvent,
  LayoutChangeEvent,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { ActivityIndicator, Text, TouchableRipple } from "react-native-paper"

import compareProps from "../../../utils/compare-props"
import MaterialIcons, { IconName } from "../material-symbols"

import useStyles from "./styles"

export type Props = {
  left?: IconName | ReactElement
  right?: IconName | ReactElement
  children: string
  onLayout?: (layout: LayoutChangeEvent) => void

  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined

  style?: ViewStyle
  titleStyle?: TextStyle
  disabled?: boolean
  loading?: boolean
  color?: ColorValue
}

const Button = ({
  disabled,
  left,
  right,
  onPress,
  style,
  titleStyle,
  color,
  children,
  onLayout,
  loading,
}: Props) => {
  const { styles, theme } = useStyles({ disabled, color })
  const _color = color ?? theme.colors.primary

  const _left = useMemo(() => {
    if (left && loading) return <ActivityIndicator />
    if (typeof left === "string") {
      return (
        <MaterialIcons
          name={left}
          color={disabled ? theme.colors.onSurfaceVariant : _color}
        />
      )
    }

    if (left) return left

    return null
  }, [left, disabled, color, loading])

  const _right = useMemo(() => {
    if (right && loading) return <ActivityIndicator />

    if (typeof right === "string") {
      return (
        <MaterialIcons
          name={right}
          color={disabled ? theme.colors.onSurfaceVariant : _color}
        />
      )
    }

    if (right) return right

    return null
  }, [right, disabled, color, loading])

  return (
    <TouchableRipple
      onLayout={onLayout}
      disabled={disabled || loading}
      rippleColor={Color.rgb(_color).alpha(0.1).string()}
      onPress={onPress}>
      <View style={[styles.main, style]}>
        {_left ? (
          <View style={[styles.iconContainer, styles.left]}>{_left}</View>
        ) : null}
        <View style={[styles.textContainer]}>
          <Text variant="titleMedium" style={[styles.title, titleStyle]}>
            {children}
          </Text>
        </View>
        {_right ? (
          <View style={[styles.iconContainer, styles.right]}>{_right}</View>
        ) : null}
      </View>
    </TouchableRipple>
  )
}

export default memo(
  Button,
  compareProps<Props>([
    "disabled",
    "left",
    "right",
    "onPress",
    "style",
    "titleStyle",
    "color",
    "children",
    "loading",
  ]),
)
