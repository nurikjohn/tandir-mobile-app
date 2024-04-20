import {
  DashPathEffect,
  Group,
  Line,
  Path,
  SkPaint,
  SkPoint,
  fitbox,
  rect,
  vec,
} from "@shopify/react-native-skia"
import { Dimensions } from "react-native"

export const CORNER_RADIUS = 12
export const DASH_WIDTH = 10

const { width: WIDTH } = Dimensions.get("window")
const PADDING = 32
export const COUPON_WIDTH = WIDTH - PADDING * 2 - 2 * CORNER_RADIUS
export const DASH_SIZE = COUPON_WIDTH / 20
export const DASH_SIZE_FULL = (WIDTH - PADDING * 2) / 20

export const CornerCutout = ({
  radius,
  x,
  y,
  rotate = 0,
  color,
}: {
  radius: number
  x: number
  y: number
  color: string
  rotate?: number
}) => {
  const src = rect(0, 0, 13, 13)
  const corner = rect(x, y, radius + 1, radius + 1)

  return (
    <Group transform={[...fitbox("cover", src, corner), { rotate }]}>
      <Path
        path="M0 12V13H13V0H12C12 6.62742 6.62742 12 0 12Z"
        color={color}
        style={"fill"}
      />
    </Group>
  )
}

export const DashCutout = ({
  p1,
  p2,
  color,
  strokeWidth,
  size = DASH_SIZE,
}: {
  strokeWidth: number
  p1: SkPoint
  p2: SkPoint
  color: string
  size?: number
}) => {
  const dash = [size, size]

  return (
    <Line
      p1={p1}
      p2={p2}
      style="stroke"
      color={color}
      strokeWidth={strokeWidth}>
      <DashPathEffect intervals={dash} />
    </Line>
  )
}
