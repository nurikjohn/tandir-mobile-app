import React, { useCallback, useEffect, useRef, useState } from "react"

import { useNavigation } from "@react-navigation/native"
import { Canvas, useFont } from "@shopify/react-native-skia"
import Color from "color"
import { Dimensions } from "react-native"
import { View } from "react-native"
import { ActivityIndicator } from "react-native"
import { FAB } from "react-native-paper"
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated"
import Share from "react-native-share"
import { captureRef } from "react-native-view-shot"

import useInvitations from "../../hooks/queries/invitations"

import MaterialSymbols from "../../components/kit/material-symbols"
import { ICoupon } from "../../types"

import Coupon, { COUPON_HEIGHT } from "./coupon"
import Paper, { PaperMethods } from "./paper"
import useStyles from "./styles"

const FONT = require("../../assets/fonts/SpaceMono-Bold.ttf")

export const RADIUS = 50
const PADDING = 32

const { width: WIDTH } = Dimensions.get("window")

const Gift = () => {
  const { styles, theme } = useStyles()

  const font = useFont(FONT, 32)
  const smallFont = useFont(FONT, 18)
  const [cutting, setCutting] = useState(false)
  const navigation = useNavigation()

  const currentCouponRef = useRef(null)

  const paperRef = useRef<PaperMethods>(null)

  const [coupons, setCoupons] = useState<ICoupon[]>([])
  const { data: _coupons, isFetching } = useInvitations()

  useEffect(() => {
    if (_coupons) {
      setCoupons(_coupons)
    }
  }, [_coupons])

  const backIcon = useCallback(
    () => (
      <MaterialSymbols
        shift={2}
        name="arrow_back"
        color={theme.colors.onSurface}
      />
    ),
    [theme],
  )

  const shareIcon = useCallback(
    () =>
      cutting ? (
        <ActivityIndicator size={24} color={theme.colors.onPrimary} />
      ) : (
        <MaterialSymbols name="cut" shift={2} color={theme.colors.onPrimary} />
      ),
    [theme, cutting],
  )

  const capture = async (coupon: ICoupon) => {
    const uri = await captureRef(currentCouponRef, {
      format: "png",
      quality: 1,
      fileName: "coupon.png",
    })

    const message = `Tandirga kirish uchun kupon: ${coupon?.code}`
    return await Share.open({
      url: uri,
      type: "image/png",
      message,
      filename: "coupon.png",
    })
  }

  const onCut = async () => {
    if (paperRef.current) {
      setCutting(true)

      try {
        const coupon = await paperRef.current?.cut()

        await capture(coupon)

        setCoupons((prev) => {
          prev.pop()
          return [...prev]
        })
      } catch (error) {
        paperRef.current?.revert()
      } finally {
        setCutting(false)
      }
    }
  }

  if (!font || !smallFont) return null

  return (
    <>
      <View style={styles.container}>
        <Paper
          ref={paperRef}
          coupons={coupons}
          font={font}
          smallFont={smallFont}
        />
      </View>

      {coupons?.length ? (
        <Canvas
          ref={currentCouponRef}
          style={{
            width: WIDTH,
            height: COUPON_HEIGHT + PADDING * 2,
            backgroundColor: "#000000",
            position: "absolute",
            top: -WIDTH,
          }}>
          <Coupon
            top={PADDING}
            index={0}
            coupon={coupons[coupons?.length - 1]}
            font={font}
            smallFont={smallFont}
          />
        </Canvas>
      ) : null}

      <Animated.View
        style={styles.backContainer}
        entering={FadeInDown.delay(600).springify()}>
        <FAB
          elevation={0}
          icon={backIcon}
          style={styles.back}
          onPress={navigation.goBack}
        />
      </Animated.View>

      {coupons?.length ? (
        <Animated.View
          style={styles.giftContainer}
          entering={FadeInDown.delay(600).springify()}
          exiting={FadeOutDown.delay(600).springify()}>
          <FAB
            icon={shareIcon}
            style={styles.gift}
            onPress={onCut}
            rippleColor={Color(theme.colors.backdrop).alpha(0.5).toString()}
            disabled={cutting}
          />
        </Animated.View>
      ) : null}
    </>
  )
}

export default Gift
