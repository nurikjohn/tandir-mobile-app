import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import LottieView, { LottieViewProps } from "lottie-react-native"
import {
  InteractionManager,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import FastImage from "react-native-fast-image"

import compareProps from "../../../utils/compare-props"

interface Props extends LottieViewProps {
  onPlay?: () => void
  instant?: boolean
  touchEnabled?: boolean
  delay?: number
  frame?: any

  name?: string
}

const LottieAnimation = (
  {
    onPlay,
    loop,
    autoPlay,
    instant,
    touchEnabled = true,
    delay,
    name,
    frame,
    style,
    ...props
  }: Props,
  ref: any,
) => {
  const animationRef = useRef<LottieView>(null)
  const [isMounted, setMounted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(frame ? autoPlay : true)

  const play = async () => {
    setIsPlaying(true)

    InteractionManager.runAfterInteractions(() => {
      animationRef.current?.play()
      onPlay?.()
    })
  }

  useEffect(() => {
    let timer: any

    if (autoPlay && isMounted) {
      if (instant) play()
      else if (delay) {
        timer = setTimeout(play, delay)
      } else {
        timer = setTimeout(play, 1000)
      }
    }

    return () => timer && clearTimeout(timer)
  }, [instant, delay, isMounted])

  useImperativeHandle(
    ref,
    () => ({
      play,
    }),
    [],
  )

  if (!touchEnabled) {
    return (
      <View style={style} onLayout={props.onLayout}>
        {!(frame && !isPlaying) ? (
          <LottieView
            renderMode="HARDWARE"
            ref={animationRef}
            loop={loop ?? false}
            resizeMode="contain"
            onAnimationFinish={() => {
              setIsPlaying(false)
            }}
            style={{
              //@ts-expect-error
              width: style?.width || 0,
              //@ts-expect-error
              height: style?.height || 0,
            }}
            {...props}
            onLayout={() => {
              setMounted(true)
            }}
          />
        ) : null}

        <FastImage
          source={frame}
          style={{
            //@ts-expect-error
            width: style?.width || 0,
            //@ts-expect-error
            height: style?.height || 0,
            position: "absolute",
            zIndex: 0,
            top: 0,
            left: 0,
            opacity: isPlaying ? 0 : 1,
          }}
        />
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!touchEnabled) return
        if (loop) return

        play()
      }}>
      <View style={style} onLayout={props.onLayout}>
        {!(frame && !isPlaying) ? (
          <LottieView
            renderMode="HARDWARE"
            ref={animationRef}
            loop={loop ?? false}
            resizeMode="contain"
            onAnimationFinish={() => {
              setIsPlaying(false)
            }}
            style={{
              //@ts-expect-error
              width: style?.width || 0,
              //@ts-expect-error
              height: style?.height || 0,
            }}
            {...props}
            onLayout={() => {
              setMounted(true)
            }}
          />
        ) : null}

        <FastImage
          source={frame}
          style={{
            //@ts-expect-error
            width: style?.width || 0,
            //@ts-expect-error
            height: style?.height || 0,
            position: "absolute",
            zIndex: 0,
            top: 0,
            left: 0,
            opacity: isPlaying ? 0 : 1,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default memo(
  forwardRef(LottieAnimation),
  compareProps<Props>(["source", "style"]),
)
