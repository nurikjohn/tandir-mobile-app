import { Children } from "react"

import {
  Canvas,
  Circle,
  DashPathEffect,
  Group,
  Line,
  Mask,
  RoundedRect,
  Skia,
  vec,
} from "@shopify/react-native-skia"
import { Dimensions, PixelRatio, View } from "react-native"
import Animated from "react-native-reanimated"

import { PRIMARY } from "../../styles/colors"

const { width: wWidth } = Dimensions.get("window")
const pd = PixelRatio.get()
const height = 150
const outer = Skia.XYWHRect(0, 0, wWidth, height)
const pad = 16
const cornerRadius = 0

const inner = Skia.RRectXY(
  Skia.XYWHRect(pad, pad, wWidth - pad * 2, height - pad),
  cornerRadius,
  cornerRadius,
)

export const Header = ({ children }: { children?: any }) => {
  return (
    <Animated.View
      style={{
        marginBottom: -pad,
        marginTop: -pad,
      }}>
      <Canvas
        style={{
          width: outer.width,
          height: outer.height,
        }}>
        <Group transform={[{ scale: 1 / pd }]}>
          <Group transform={[{ scale: pd }]} clip={inner}>
            <Mask
              mode="luminance"
              mask={
                <Group>
                  <RoundedRect rect={inner} color={"white"} />
                  <Line
                    p1={vec(inner.rect.x + 6, inner.rect.y)}
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
                    cy={inner.rect.y + inner.rect.height}
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
          </Group>
        </Group>
      </Canvas>

      <View
        style={{
          position: "absolute",
          top: pad,
          left: pad,
          bottom: 0,
          right: pad,
        }}>
        {children}
      </View>
    </Animated.View>
  )
}
