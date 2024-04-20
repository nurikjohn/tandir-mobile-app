import { memo, useMemo } from "react"

import type { SkFont } from "@shopify/react-native-skia"
import {
  Group,
  Path,
  Rect,
  Skia,
  Text,
  fitbox,
  rect,
  vec,
} from "@shopify/react-native-skia"
import { Dimensions } from "react-native"

import { PRIMARY } from "../../styles/colors"
import { ICoupon } from "../../types"
import compareProps from "../../utils/compare-props"

import {
  CORNER_RADIUS,
  CornerCutout,
  DASH_SIZE,
  DASH_WIDTH,
  DashCutout,
} from "./cutouts"

const PADDING = 32
const BOX_PADDING = 20

const { width: WIDTH } = Dimensions.get("window")

export const COUPON_HEIGHT = 216 - PADDING * 2
const COUPON_WIDTH = WIDTH - PADDING * 2

const inner = Skia.XYWHRect(PADDING, 0, COUPON_WIDTH, COUPON_HEIGHT)

interface Props {
  coupon: ICoupon
  font: SkFont
  smallFont: SkFont
  index: number
  top: number
}

export type CouponMethods = {
  cut: (shouldDelay: boolean) => Promise<ICoupon>
  revert: (cb?: any) => void
}

const DashedRectangle = ({
  x,
  y,
  width,
  height,
}: {
  x: number
  y: number
  width: number
  height: number
}) => {
  const aspectRatio = 28 / 105
  const src = rect(0, 0, 28, 105)
  const dst = rect(x, y, width, height)

  return (
    <Group>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={"stroke"}
        strokeWidth={3}
      />
      <Group clip={rect(x, y, width, height)}>
        <Group transform={fitbox("cover", src, dst)}>
          <Path
            path="M3 2.00011L4.06066 0.939453L27.0607 23.9395L26 25.0001L3 2.00011ZM7 2.00011L8.06066 0.939453L27.0607 19.9395L26 21.0001L7 2.00011ZM11 2.00011L12.0607 0.939453L27.0607 15.9395L26 17.0001L11 2.00011ZM15 2.00011L16.0607 0.939453L27.0607 11.9395L26 13.0001L15 2.00011ZM26 9.00011L19 2.00011L20.0607 0.939453L27.0607 7.93945L26 9.00011ZM26 5.00011L23 2.00011L24.0607 0.939453L27.0607 3.93945L26 5.00011ZM5.96046e-08 3.00011L1.06066 1.93945L27.0607 27.9395L26 29.0001L5.96046e-08 3.00011ZM5.96046e-08 7.00011L1.06066 5.93945L27.0607 31.9395L26 33.0001L5.96046e-08 7.00011ZM5.96046e-08 11.0001L1.06066 9.93945L27.0607 35.9395L26 37.0001L5.96046e-08 11.0001ZM5.96046e-08 15.0001L1.06066 13.9395L27.0607 39.9395L26 41.0001L5.96046e-08 15.0001ZM5.96046e-08 19.0001L1.06066 17.9395L27.0607 43.9395L26 45.0001L5.96046e-08 19.0001ZM5.96046e-08 23.0001L1.06066 21.9395L27.0607 47.9395L26 49.0001L5.96046e-08 23.0001ZM5.96046e-08 27.0001L1.06066 25.9395L27.0607 51.9395L26 53.0001L5.96046e-08 27.0001ZM5.96046e-08 31.0001L1.06066 29.9395L27.0607 55.9395L26 57.0001L5.96046e-08 31.0001ZM5.96046e-08 35.0001L1.06066 33.9395L27.0607 59.9395L26 61.0001L5.96046e-08 35.0001ZM5.96046e-08 39.0001L1.06066 37.9395L27.0607 63.9395L26 65.0001L5.96046e-08 39.0001ZM5.96046e-08 43.0001L1.06066 41.9395L27.0607 67.9395L26 69.0001L5.96046e-08 43.0001ZM5.96046e-08 47.0001L1.06066 45.9395L27.0607 71.9395L26 73.0001L5.96046e-08 47.0001ZM5.96046e-08 51.0001L1.06066 49.9395L27.0607 75.9395L26 77.0001L5.96046e-08 51.0001ZM5.96046e-08 55.0001L1.06066 53.9395L27.0607 79.9395L26 81.0001L5.96046e-08 55.0001ZM5.96046e-08 59.0001L1.06066 57.9395L27.0607 83.9395L26 85.0001L5.96046e-08 59.0001ZM5.96046e-08 63.0001L1.06066 61.9395L27.0607 87.9395L26 89.0001L5.96046e-08 63.0001ZM5.96046e-08 67.0001L1.06066 65.9395L27.0607 91.9395L26 93.0001L5.96046e-08 67.0001ZM5.96046e-08 71.0001L1.06066 69.9395L27.0607 95.9395L26 97.0001L5.96046e-08 71.0001ZM5.96046e-08 75.0001L1.06066 73.9395L27.0607 99.9395L26 101L5.96046e-08 75.0001ZM5.96046e-08 79.0001L1.06066 77.9395L27.0607 103.939L26 105L5.96046e-08 79.0001ZM22 105L5.96046e-08 83.0001L1.06066 81.9395L23.0607 103.939L22 105ZM18 105L5.96046e-08 87.0001L1.06066 85.9395L19.0607 103.939L18 105ZM5.96046e-08 91.0001L1.06066 89.9395L15.0607 103.939L14 105L5.96046e-08 91.0001ZM5.96046e-08 95.0001L1.06066 93.9395L11.0607 103.939L10 105L5.96046e-08 95.0001ZM7.06066 103.939L6 105L5.96046e-08 99.0001L1.06066 97.9395L7.06066 103.939ZM2 105L0 103L1.06066 101.939L3.06066 103.939L2 105Z"
            color="black"
            style={"fill"}
          />
        </Group>
      </Group>
    </Group>
  )
}

const Coupon = ({ top = 216, font, smallFont, coupon, index }: Props) => {
  const textDimensions1 = useMemo(() => font.measureText("TANDIR"), [])
  const textDimensions2 = useMemo(() => font.measureText("KUPON"), [])
  const codeDimensions = useMemo(() => smallFont.measureText(coupon.code), [])

  const origin1 = {
    x: inner.x + BOX_PADDING + 18,
    y: inner.y + inner.height / 2,
  }

  const origin2 = {
    x: inner.x + inner.width - BOX_PADDING - 21,
    y: inner.y + inner.height / 2,
  }

  return (
    <Group transform={[{ translateY: top + index * COUPON_HEIGHT }]}>
      <Group clip={inner}>
        <Group>
          <Group
            clip={rect(
              inner.x + CORNER_RADIUS,
              inner.y,
              inner.width - 2 * CORNER_RADIUS,
              DASH_WIDTH,
            )}>
            <DashCutout
              strokeWidth={DASH_WIDTH}
              color={PRIMARY}
              p1={vec(inner.x + CORNER_RADIUS - DASH_SIZE / 2, inner.y)}
              p2={vec(inner.x + inner.width, inner.y)}
            />
          </Group>

          <Rect
            x={inner.x + CORNER_RADIUS}
            y={inner.y + DASH_WIDTH / 2 - 1}
            width={inner.width - 2 * CORNER_RADIUS}
            height={inner.height - DASH_WIDTH + 2}
            color={PRIMARY}
          />
          <Rect
            x={inner.x}
            y={inner.y + CORNER_RADIUS}
            width={CORNER_RADIUS + 2}
            height={inner.height - 2 * CORNER_RADIUS}
            color={PRIMARY}
          />
          <Rect
            x={inner.x + inner.width - CORNER_RADIUS - 2}
            y={inner.y + CORNER_RADIUS}
            width={CORNER_RADIUS + 2}
            height={inner.height - 2 * CORNER_RADIUS}
            color={PRIMARY}
          />

          <Group
            clip={rect(
              inner.x + CORNER_RADIUS,
              inner.height - DASH_WIDTH,
              inner.width - 2 * CORNER_RADIUS,
              DASH_WIDTH,
            )}>
            <DashCutout
              strokeWidth={DASH_WIDTH}
              color={PRIMARY}
              p1={vec(
                inner.x + CORNER_RADIUS - DASH_SIZE / 2,
                inner.y + inner.height - 1,
              )}
              p2={vec(inner.x + inner.width, inner.y + inner.height - 1)}
            />
          </Group>

          <Group color="black">
            <Rect
              x={inner.x + BOX_PADDING}
              y={inner.y + BOX_PADDING}
              width={inner.width - BOX_PADDING * 2}
              height={inner.height - BOX_PADDING * 2}
              strokeWidth={3}
              style="stroke"
            />

            <Text
              x={origin1.x - codeDimensions.width / 2}
              y={origin1.y + codeDimensions.height / 2}
              text={coupon.code}
              font={smallFont}
              transform={[{ rotateZ: -Math.PI / 2 }]}
              origin={origin1}
            />

            <Text
              x={origin2.x - codeDimensions.width / 2}
              y={origin2.y + codeDimensions.height / 2}
              text={coupon.code}
              font={smallFont}
              transform={[{ rotateZ: -Math.PI / 2 }]}
              origin={origin2}
            />

            <DashedRectangle
              x={inner.x + BOX_PADDING + 39}
              y={inner.y + BOX_PADDING}
              width={26}
              height={inner.height - BOX_PADDING * 2}
            />

            <DashedRectangle
              x={inner.x + inner.width - BOX_PADDING - 39 - 26}
              y={inner.y + BOX_PADDING}
              width={26}
              height={inner.height - BOX_PADDING * 2}
            />

            <Text
              x={inner.x + inner.width / 2 - textDimensions1.width / 2}
              y={inner.y + inner.height / 2 - 4}
              text={"TANDIR"}
              font={font}
            />
            <Text
              x={inner.x + inner.width / 2 - textDimensions2.width / 2}
              y={inner.y + inner.height / 2 + textDimensions2.height + 4}
              text={"KUPON"}
              font={font}
            />
          </Group>

          <CornerCutout
            color={PRIMARY}
            x={inner.x}
            y={inner.y}
            radius={CORNER_RADIUS}
          />
          <CornerCutout
            color={PRIMARY}
            x={inner.x + inner.width}
            y={inner.y}
            radius={CORNER_RADIUS}
            rotate={Math.PI / 2}
          />
          <CornerCutout
            color={PRIMARY}
            x={inner.x}
            y={inner.y + inner.height}
            radius={CORNER_RADIUS}
            rotate={-Math.PI / 2}
          />
          <CornerCutout
            color={PRIMARY}
            x={inner.x + inner.width}
            y={inner.y + inner.height}
            radius={CORNER_RADIUS}
            rotate={Math.PI}
          />
        </Group>
      </Group>
    </Group>
  )
}

export default memo(Coupon, compareProps(["coupon", "index", "top"]))
