import { MutableRefObject } from "react"

import type { SkFont } from "@shopify/react-native-skia"
import {
  Canvas,
  Circle,
  DashPathEffect,
  Group,
  Line,
  Line2DPathEffect,
  Mask,
  Paint,
  Rect,
  RoundedRect,
  RuntimeShader,
  Skia,
  Text,
  processTransform2d,
  useImage,
  useTouchHandler,
  vec,
} from "@shopify/react-native-skia"
import { Dimensions, PixelRatio } from "react-native"
import {
  ComposedGesture,
  Gesture,
  GestureDetector,
  GestureType,
} from "react-native-gesture-handler"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"

import { GRAY, PRIMARY } from "../../styles/colors"
import { ICoupon } from "../../types"

import { pageCurl } from "./pageCurl"

const { width: wWidth } = Dimensions.get("window")
const pd = PixelRatio.get()
const height = 192
const outer = Skia.XYWHRect(0, 0, wWidth, height)
const pad = 16
const cornerRadius = 0

const inner = Skia.RRectXY(
  Skia.XYWHRect(pad, pad, wWidth - pad * 2, height - pad * 2),
  cornerRadius,
  cornerRadius,
)

export interface Project {
  id: string
  title: string
  size: string
  duration: string
  picture: number
  color: string
}

interface ProjectProps {
  coupon: ICoupon
  font: SkFont
  smallFont: SkFont
  index: number
  onRemove: any
  last: boolean
  panGestureRef: MutableRefObject<GestureType | undefined>
}

export const Project = ({
  font,
  index,
  last,
  onRemove,
  smallFont,
  coupon,
  panGestureRef,
}: ProjectProps) => {
  const { width } = outer
  const origin = useSharedValue(width)
  const pointer = useSharedValue(index == 100 ? width - 180 : width)
  const zIndex = useSharedValue(1)

  // const panGesture = Gesture.Pan()
  //   .onStart(({ x }) => {
  //     origin.value = x
  //     zIndex.value = 1000
  //   })
  //   .onChange(({ x }) => {
  //     pointer.value = x
  //   })
  //   .onEnd(() => {
  //     if (pointer.value < 100) {
  //       pointer.value = withTiming(-width, {
  //         duration: 100,
  //         easing: Easing.inOut(Easing.ease),
  //       })
  //       origin.value = withTiming(
  //         width,
  //         {
  //           duration: 100,
  //           easing: Easing.inOut(Easing.ease),
  //         },
  //         () => {
  //           runOnJS(onRemove)(coupon.id)
  //         },
  //       )
  //     } else {
  //       zIndex.value = withDelay(450, withTiming(1, { duration: 0 }))

  //       pointer.value = withTiming(width, {
  //         duration: 450,
  //         easing: Easing.inOut(Easing.ease),
  //       })
  //       origin.value = withTiming(width, {
  //         duration: 450,
  //         easing: Easing.inOut(Easing.ease),
  //       })
  //     }
  //   })
  //   .withRef(panGestureRef)

  const onTouch = useTouchHandler({
    onStart: ({ x }) => {
      origin.value = x
      zIndex.value = 1000
    },
    onActive: ({ x }) => {
      pointer.value = x
      zIndex.value = 1000
    },
    onEnd: () => {
      // if (pointer.value < 100) {
      //   pointer.value = withTiming(-width, {
      //     duration: 100,
      //     easing: Easing.inOut(Easing.ease),
      //   })
      //   origin.value = withTiming(
      //     width,
      //     {
      //       duration: 100,
      //       easing: Easing.inOut(Easing.ease),
      //     },
      //     () => {
      //       runOnJS(onRemove)(coupon.id)
      //     },
      //   )
      // } else {
      zIndex.value = withDelay(450, withTiming(1, { duration: 0 }))

      pointer.value = withTiming(width, {
        duration: 450,
        easing: Easing.inOut(Easing.ease),
      })
      origin.value = withTiming(width, {
        duration: 450,
        easing: Easing.inOut(Easing.ease),
      })
      // }
    },
  })

  const uniforms = useDerivedValue(() => {
    return {
      pointer: pointer.value * pd,
      origin: origin.value * pd,
      resolution: [outer.width * pd, outer.height * pd],
      container: [
        inner.rect.x,
        inner.rect.y,
        inner.rect.x + inner.rect.width,
        inner.rect.y + inner.rect.height,
      ].map((v) => v * pd),
      cornerRadius: 12 * pd,
    }
  }, [origin, pointer])

  const style = useAnimatedStyle(() => {
    let top = inner.rect.height * index

    return {
      position: "absolute",
      zIndex: zIndex.value,
      top,
    }
  }, [zIndex])

  const boxPad = 20

  const code = coupon.code
  const textDimensions1 = font.measureText("TANDIR")
  const textDimensions2 = font.measureText("KUPON")
  const textDimensions3 = font.measureText("ISHLATILGAN")
  const codeDimensions = smallFont.measureText(code)

  const origin1 = {
    x: inner.rect.x + boxPad + 18,
    y: inner.rect.y + inner.rect.height / 2,
  }

  const origin2 = {
    x: inner.rect.x + inner.rect.width - boxPad - 21,
    y: inner.rect.y + inner.rect.height / 2,
  }

  return (
    <Animated.View style={style}>
      {/* <GestureDetector gesture={panGesture}> */}
      <Canvas
        style={{
          width: outer.width,
          height: outer.height,
        }}
        onTouch={last ? onTouch : undefined}>
        <Group>
          <Text
            y={inner.rect.y + inner.rect.height / 2 - 4}
            x={inner.rect.x + inner.rect.width / 2 - textDimensions2.width / 2}
            text={"KUPON"}
            color={"white"}
            font={font}
            opacity={0.1}
          />
          <Text
            x={inner.rect.x + inner.rect.width / 2 - textDimensions3.width / 2}
            y={
              inner.rect.y + inner.rect.height / 2 + textDimensions3.height + 4
            }
            text={"ISHLATILGAN"}
            color={"white"}
            font={font}
            opacity={0.1}
          />
        </Group>

        {coupon.accepted_by ? null : (
          <Group transform={[{ scale: 1 / pd }]}>
            <Group
              layer={
                <Paint>
                  <RuntimeShader source={pageCurl} uniforms={uniforms} />
                </Paint>
              }
              transform={[{ scale: pd }]}
              clip={inner}>
              <Mask
                mode="luminance"
                mask={
                  <Group>
                    <RoundedRect rect={inner} color={"white"} />
                    <Line
                      p1={vec(inner.rect.x + 18, inner.rect.y)}
                      p2={vec(inner.rect.x + inner.rect.width, inner.rect.y)}
                      color="black"
                      style="stroke"
                      strokeWidth={5}>
                      <DashPathEffect intervals={[12, 12]} />
                    </Line>

                    <Line
                      p1={vec(
                        inner.rect.x + 18,
                        inner.rect.y + inner.rect.height,
                      )}
                      p2={vec(
                        inner.rect.x + inner.rect.width,
                        inner.rect.y + inner.rect.height,
                      )}
                      color="black"
                      style="stroke"
                      strokeWidth={5}>
                      <DashPathEffect intervals={[12, 12]} />
                    </Line>

                    <Circle
                      cx={inner.rect.x}
                      cy={inner.rect.y}
                      r={12}
                      color="black"
                    />
                    <Circle
                      cx={inner.rect.x}
                      cy={inner.rect.y + inner.rect.height}
                      r={12}
                      color="black"
                    />
                    <Circle
                      cx={inner.rect.x + inner.rect.width}
                      cy={inner.rect.y}
                      r={12}
                      color="black"
                    />
                    <Circle
                      cx={inner.rect.x + inner.rect.width}
                      cy={inner.rect.y + inner.rect.height}
                      r={12}
                      color="black"
                    />
                  </Group>
                }>
                <RoundedRect rect={inner} color={PRIMARY} />
              </Mask>

              <Rect
                x={inner.rect.x + boxPad}
                y={inner.rect.y + boxPad}
                width={inner.rect.width - boxPad * 2}
                height={inner.rect.height - boxPad * 2}
                strokeWidth={3}
                style="stroke"
              />

              <Text
                x={origin1.x - codeDimensions.width / 2}
                y={origin1.y + codeDimensions.height / 2}
                text={code}
                color="black"
                font={smallFont}
                transform={[{ rotateZ: -Math.PI / 2 }]}
                origin={origin1}
              />

              <Text
                x={origin2.x - codeDimensions.width / 2}
                y={origin2.y + codeDimensions.height / 2}
                text={code}
                color="black"
                font={smallFont}
                transform={[{ rotateZ: -Math.PI / 2 }]}
                origin={origin2}
              />

              <Rect
                x={inner.rect.x + boxPad + 39}
                y={inner.rect.y + boxPad}
                width={32}
                height={inner.rect.height - boxPad * 2}
                strokeWidth={3}
                style="stroke"
              />
              <Rect
                x={inner.rect.x + boxPad + 39}
                y={inner.rect.y + boxPad}
                width={32}
                height={inner.rect.height - boxPad * 2}>
                <Line2DPathEffect
                  width={1}
                  matrix={processTransform2d([
                    { scaleY: 3 },
                    { translateY: 10 },
                  ])}
                />
              </Rect>

              <Rect
                x={inner.rect.x + inner.rect.width - boxPad - 39 - 32}
                y={inner.rect.y + boxPad}
                width={32}
                height={inner.rect.height - boxPad * 2}
                strokeWidth={3}
                style="stroke"
              />
              <Rect
                x={inner.rect.x + inner.rect.width - boxPad - 39 - 32}
                y={inner.rect.y + boxPad}
                width={32}
                height={inner.rect.height - boxPad * 2}>
                <Line2DPathEffect
                  width={1}
                  matrix={processTransform2d([{ scaleY: 3 }])}
                />
              </Rect>

              <Text
                x={
                  inner.rect.x +
                  inner.rect.width / 2 -
                  textDimensions1.width / 2
                }
                y={inner.rect.y + inner.rect.height / 2 - 4}
                text={"TANDIR"}
                color="black"
                font={font}
              />
              <Text
                x={
                  inner.rect.x +
                  inner.rect.width / 2 -
                  textDimensions2.width / 2
                }
                y={
                  inner.rect.y +
                  inner.rect.height / 2 +
                  textDimensions2.height +
                  4
                }
                text={"KUPON"}
                color="black"
                font={font}
              />
            </Group>
          </Group>
        )}
      </Canvas>
      {/* </GestureDetector> */}
    </Animated.View>
  )
}
