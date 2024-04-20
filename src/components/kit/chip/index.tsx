import { memo } from "react"

import Color from "color"
import {
  ColorValue,
  GestureResponderEvent,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Text, TouchableRipple } from "react-native-paper"

import compareProps from "../../../utils/compare-props"

import useStyles from "./styles"

type Props = {
  children: string
  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined

  style?: ViewStyle
  active?: boolean
  disabled?: boolean
  color?: ColorValue
}

const Chip = ({ active, disabled, onPress, style, color, children }: Props) => {
  const { styles, theme } = useStyles({ active, disabled, color })
  const _color = color ?? theme.colors.onSurface

  return (
    <TouchableOpacity activeOpacity={0.5} disabled={disabled} onPress={onPress}>
      <View style={[styles.main, style]}>
        <Text variant="labelLarge" style={[styles.label]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default memo(
  Chip,
  compareProps<Props>(["children", "color", "disabled", "style", "active"]),
)
