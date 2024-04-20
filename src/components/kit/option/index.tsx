import { memo } from "react"

import Color from "color"
import {
  ColorValue,
  GestureResponderEvent,
  TextStyle,
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

  textStyle?: TextStyle
  style?: ViewStyle
  active?: boolean
  disabled?: boolean
  loading?: boolean
  color?: ColorValue
}

const Option = ({
  active,
  disabled,
  onPress,
  style,
  textStyle,
  color,
  children,
}: Props) => {
  const { styles, theme } = useStyles({ disabled, active, color })

  return (
    <TouchableRipple
      disabled={disabled}
      rippleColor={Color.rgb(theme.colors.primary).alpha(0.1).string()}
      onPress={onPress}>
      <View style={[styles.main, style]}>
        <Text variant="bodyMedium" style={[styles.title, textStyle]}>
          {children}
        </Text>
      </View>
    </TouchableRipple>
  )
}

export default memo(
  Option,
  compareProps<Props>([
    "disabled",
    "onPress",
    "style",
    "textStyle",
    "color",
    "children",
  ]),
)
