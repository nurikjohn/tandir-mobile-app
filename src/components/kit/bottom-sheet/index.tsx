import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"

import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetProps,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import { BackHandler, Keyboard } from "react-native"
import { ReduceMotion } from "react-native-reanimated"

import CustomBottomSheetBackdrop from "./backdrop"
import useStyles from "./style"

interface Props extends BottomSheetModalProps {
  onOpen?: () => void
  onClose?: () => void
  enableDismissOnBackdropPress?: boolean
}

export interface BottomSheetMethods {
  open: () => void
  close: () => void
  snapToIndex: (index: number) => void
}

const CloseHandler = ({ close }: { close: () => void }) => {
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      close?.()

      return true
    })

    return () => {
      sub.remove()
    }
  }, [])

  return null
}

const BottomSheet = (
  {
    onOpen,
    onClose,
    backgroundStyle,
    children,
    enableDismissOnBackdropPress = true,
    ...props
  }: Props,
  ref: React.Ref<BottomSheetMethods>,
) => {
  const sheet = useRef<BottomSheetModal>(null)
  const { styles } = useStyles()

  const overrideConfig = useBottomSheetSpringConfigs({
    damping: 500,
    stiffness: 1000,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10,
    reduceMotion: ReduceMotion.Never,
  })

  const close = () => {
    sheet?.current?.dismiss()
    onClose?.()
  }

  const open = () => {
    sheet?.current?.present()
    Keyboard.dismiss()
    onOpen?.()
  }

  const snapToIndex = (index: number) => {
    sheet?.current?.snapToIndex(index)
  }

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
      snapToIndex,
    }),
    [],
  )

  if (!props.snapPoints) return null

  return (
    <BottomSheetModal
      ref={sheet}
      index={0}
      enableHandlePanningGesture
      enableContentPanningGesture
      backdropComponent={(props) => (
        <CustomBottomSheetBackdrop
          {...props}
          enableDismissOnPress={enableDismissOnBackdropPress}
        />
      )}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={[styles.background, backgroundStyle]}
      animationConfigs={overrideConfig}
      {...props}>
      <>
        {children}
        <CloseHandler close={close} />
      </>
    </BottomSheetModal>
  )
}

export default memo(forwardRef(BottomSheet))
