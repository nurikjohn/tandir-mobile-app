import React, { memo } from "react"

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet"
import { StyleProp, ViewStyle } from "react-native"

import useStyles from "./style"

interface Props extends BottomSheetBackdropProps {
  style?: StyleProp<ViewStyle>
  enableDismissOnPress?: boolean
}

const CustomBottomSheetBackdrop = ({
  enableDismissOnPress,
  style,
  ...props
}: Props) => {
  const { styles } = useStyles()

  return (
    <BottomSheetBackdrop
      enableTouchThrough
      style={[styles.backdrop, style]}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior={enableDismissOnPress ? "close" : "none"}
      opacity={1}
      {...props}
    />
  )
}

export default memo(CustomBottomSheetBackdrop)
