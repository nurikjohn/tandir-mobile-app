import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"

import Clipboard from "@react-native-clipboard/clipboard"
import {
  Canvas,
  Group,
  Paint,
  RuntimeShader,
  SkFont,
  Skia,
  useTouchHandler,
} from "@shopify/react-native-skia"
import { Alert, Dimensions, PixelRatio } from "react-native"
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import { ICoupon } from "../../types"
import compareProps from "../../utils/compare-props"

import Coupon, { COUPON_HEIGHT, CouponMethods } from "./coupon"
import Header from "./header"
import { pageCurl as paperShader } from "./pageCurl"

type Props = {
  coupons: ICoupon[]
  font: SkFont
  smallFont: SkFont
}

const PIXEL_DENSITY = PixelRatio.get()
const RADIUS = 50
const COUPON_RADIUS = 60
const PADDING = 32
const INITIAL_POSITION = RADIUS

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window")
const outer = Skia.XYWHRect(0, 0, WIDTH, HEIGHT)

const inner = Skia.RRectXY(
  Skia.XYWHRect(PADDING, 0, WIDTH - PADDING * 2, HEIGHT),
  0,
  0,
)

const SPRING_CONFIG = {
  mass: 5,
  damping: 30,
  stiffness: 150,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
}

const CIRCLE_LENGTH = (Math.PI / 2) * RADIUS

export type PaperMethods = {
  cut: () => Promise<ICoupon>
  revert: () => void
}

const Paper = (
  { coupons, font, smallFont }: Props,
  ref: React.Ref<PaperMethods>,
) => {
  const COUPONS_COUNT = coupons.length
  const [headerHeight, setHeaderHeight] = useState(216)

  const _couponCount = useSharedValue(coupons.length)
  const _headerHeight = useSharedValue(headerHeight)
  const origin = useSharedValue(0)
  const position = useSharedValue(
    -(headerHeight + (COUPONS_COUNT - 1) * COUPON_HEIGHT),
  )

  const pressed = useSharedValue(0)
  const start = useSharedValue(0)
  const active_coupon = useSharedValue(COUPONS_COUNT - 1)
  const coupon_position = useSharedValue(0)

  const initiated = useSharedValue(false)
  const scrollEnabled = useSharedValue(true)

  useEffect(() => {
    _headerHeight.value = headerHeight
  }, [headerHeight])

  const _topLimit = useDerivedValue(() => {
    return -(
      _headerHeight.value +
      COUPON_HEIGHT * _couponCount.value -
      CIRCLE_LENGTH -
      RADIUS +
      10
    )
  }, [])

  const snapPoints = useMemo(() => {
    const points = [
      INITIAL_POSITION,
      -(headerHeight + COUPON_HEIGHT - CIRCLE_LENGTH - RADIUS - 40),
      -(headerHeight + COUPON_HEIGHT * 2 - CIRCLE_LENGTH - RADIUS - 40),
    ].slice(0, COUPONS_COUNT || 1)

    return points
  }, [headerHeight, COUPONS_COUNT])

  const uniforms = useDerivedValue(() => {
    return {
      position: position.value * PIXEL_DENSITY,
      resolution: [outer.width * PIXEL_DENSITY, outer.height * PIXEL_DENSITY],
      container: [
        inner.rect.x,
        inner.rect.y,
        inner.rect.x + inner.rect.width,
        inner.rect.y + inner.rect.height,
      ].map((v) => v * PIXEL_DENSITY),
      r: RADIUS * PIXEL_DENSITY,
      coupon_r: COUPON_RADIUS * PIXEL_DENSITY,
      header_height: _headerHeight.value * PIXEL_DENSITY,
      coupon_height: COUPON_HEIGHT * PIXEL_DENSITY,
      current_coupon: active_coupon.value,
      coupon_distance: coupon_position.value * PIXEL_DENSITY,
    }
  }, [])

  const onCouponPress = (index: number) => {
    const coupon = coupons[index]

    if (coupon) {
      Clipboard.setString(coupon.code)
      Alert.alert(coupon.code, "Kupon kodi nusxalandi")
    }
  }

  const onTouch = useTouchHandler(
    {
      onStart: ({ y }) => {
        origin.value = y
        start.value = position.value
        pressed.value = withTiming(1, { duration: 150 })
      },
      onActive: ({ y }) => {
        if (!scrollEnabled.value) return

        const distance = y - origin.value
        const nextPos = start.value + distance

        if (nextPos < 150 && nextPos > _topLimit.value) {
          position.value = nextPos
        }
      },
      onEnd: ({ y, velocityY }) => {
        if (pressed.value < 1 && velocityY == 0) {
          const couponIndex = Math.floor(
            (y - _headerHeight.value - position.value) / COUPON_HEIGHT,
          )

          runOnJS(onCouponPress)(couponIndex)
        }

        const closestSnapPoint = snapPoints
          .map((val, index) => {
            return {
              val,
              index,
              distance: Math.abs(position.value - val),
            }
          })
          .sort((a, b) => a.distance - b.distance)[0]

        position.value = withSpring(closestSnapPoint.val, SPRING_CONFIG)

        origin.value = 0
        start.value = 0
        pressed.value = 0
      },
    },
    [],
  )

  useEffect(() => {
    _couponCount.value = COUPONS_COUNT
    active_coupon.value = COUPONS_COUNT - 1
    coupon_position.value = 0
    scrollEnabled.value = true
    if (initiated.value) {
      position.value = withSpring(INITIAL_POSITION, SPRING_CONFIG)
    } else {
      position.value = withDelay(
        250,
        withSpring(INITIAL_POSITION, SPRING_CONFIG),
      )
    }
  }, [COUPONS_COUNT])

  useImperativeHandle(
    ref,
    () => ({
      cut: () => {
        return new Promise(async (resolve, reject) => {
          const count = coupons.length
          const coupon = coupons[count - 1]

          scrollEnabled.value = false
          active_coupon.value = count - 1

          let shouldDelay = false
          let pos = 0

          if (
            count == 3 &&
            (Math.abs(position.value - snapPoints[0]) < 50 ||
              Math.abs(position.value - snapPoints[2]) < 50)
          ) {
            shouldDelay = true
            pos = snapPoints[1]
          } else if (
            count == 2 &&
            Math.abs(position.value - snapPoints[1]) < 50
          ) {
            shouldDelay = true
            pos = snapPoints[0]
          }

          const onFinish = () => {
            scrollEnabled.value = true
            resolve(coupon)
          }

          if (shouldDelay) {
            position.value = withSpring(pos, SPRING_CONFIG)
            coupon_position.value = withDelay(
              1000,
              withTiming(
                WIDTH + RADIUS,
                {
                  duration: 2000,
                },
                () => {
                  runOnJS(onFinish)()
                },
              ),
            )
          } else {
            coupon_position.value = withTiming(
              WIDTH + RADIUS,
              {
                duration: 2000,
              },
              () => {
                runOnJS(onFinish)()
              },
            )
          }
        })
      },
      revert: () => {
        coupon_position.value = withTiming(0, {
          duration: 1000,
        })
      },
    }),
    [coupons, snapPoints],
  )

  return (
    <Canvas
      style={{
        width: WIDTH,
        minHeight: HEIGHT,
      }}
      onTouch={onTouch}>
      <Group transform={[{ scale: 1 / PIXEL_DENSITY }]}>
        <Group
          layer={
            <Paint>
              <RuntimeShader source={paperShader} uniforms={uniforms} />
            </Paint>
          }
          transform={[{ scale: PIXEL_DENSITY }]}>
          <Header
            font={font}
            smallFont={smallFont}
            onLayout={setHeaderHeight}
          />

          {coupons?.map((coupon, index) => (
            <Coupon
              key={coupon.code}
              top={headerHeight}
              index={index}
              coupon={coupon}
              font={font}
              smallFont={smallFont}
            />
          ))}
        </Group>
      </Group>
    </Canvas>
  )
}

export default memo(forwardRef(Paper), compareProps(["coupons"]))
