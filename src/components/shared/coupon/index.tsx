import { forwardRef } from "react"

import { GestureResponderEvent, Image, View, ViewStyle } from "react-native"
import { AnimatableStringValue } from "react-native"
import { Text, TouchableRipple, useTheme } from "react-native-paper"
import { Path, Svg } from "react-native-svg"

import { ICoupon } from "../../../types"

import useStyles from "./styles"

const pattern = require("../../../assets/images/pattern.png")

type Props = {
  item: ICoupon

  onPress?:
    | (((event: GestureResponderEvent) => void) &
        ((e: GestureResponderEvent) => void))
    | undefined

  style?: ViewStyle
}

export const Divider = ({
  bottom,
  disableCircles,
  color,
}: {
  color?: string
  bottom?: boolean
  disableCircles?: boolean
}) => {
  const theme = useTheme()

  const _color = color || "#000000"

  return (
    <>
      {disableCircles ? null : (
        <View
          style={[
            {
              width: 24,
              height: 24,
              backgroundColor: _color,
              borderRadius: 12,
              position: "absolute",
              left: -12,
            },
            bottom
              ? {
                  bottom: -12,
                }
              : {
                  top: -12,
                },
          ]}
        />
      )}

      <Svg
        style={[
          {
            position: "absolute",
          },
          bottom
            ? {
                bottom: -2,
              }
            : {
                top: -2,
              },
        ]}
        width="700"
        height="4"
        viewBox="0 0 700 4"
        fill="none">
        <Path
          d="M0 2L700 2.00003"
          stroke={_color}
          strokeWidth="4"
          strokeDasharray="12 10"
          x={"-12"}
        />
      </Svg>
      {disableCircles ? null : (
        <View
          style={[
            {
              width: 24,
              height: 24,
              backgroundColor: _color,
              borderRadius: 12,
              position: "absolute",
              right: -12,
            },
            bottom
              ? {
                  bottom: -12,
                }
              : {
                  top: -12,
                },
          ]}
        />
      )}
    </>
  )
}

const Coupon = ({ item, onPress, style }: Props) => {
  const inactive = !!item.accepted_time
  const { styles, theme } = useStyles({ inactive })

  return (
    <View>
      <TouchableRipple
        rippleColor={theme.colors.primaryContainer}
        onPress={onPress}>
        <View style={[styles.main, style]}>
          <Divider />
          <View style={[styles.content]}>
            {inactive ? null : (
              <>
                <View style={styles.codeContainer}>
                  <Text style={styles.code}>{item.code}</Text>
                </View>
                <View style={styles.dashContainer}>
                  <Image style={styles.dash} source={pattern} />
                </View>
              </>
            )}
            <View style={styles.couponTitleContainer}>
              <Text style={styles.couponTitle}>
                {inactive ? `KUPON\nISHLATILGAN` : `TANDIR\nKUPON`}
              </Text>
            </View>
            {inactive ? null : (
              <>
                <View style={styles.dashContainer}>
                  <Image style={styles.dash} source={pattern} />
                </View>
                <View style={styles.codeContainer}>
                  <Text style={styles.code}>{item.code}</Text>
                </View>
              </>
            )}
          </View>
          <Divider bottom />
        </View>
      </TouchableRipple>
    </View>
  )
}

export default Coupon
