import React, { useCallback, useMemo, useRef, useState } from "react"

import { useNavigation } from "@react-navigation/native"
import Color from "color"
import {
  Alert,
  Platform,
  StatusBar,
  View,
  useWindowDimensions,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { FAB, Text } from "react-native-paper"
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInUp,
} from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import Share from "react-native-share"
import { captureRef } from "react-native-view-shot"

import useInvitations from "../../hooks/queries/invitations"

import MaterialSymbols from "../../components/kit/material-symbols"
import Coupon, { Divider } from "../../components/shared/coupon"

import useStyles from "./styles"

function Gift(): JSX.Element {
  const { styles, theme } = useStyles()
  const navigation = useNavigation()
  const couponRef = useRef(null)

  const { data: invitations } = useInvitations()
  const { top } = useSafeAreaInsets()

  const activeInvitations = useMemo(() => {
    return invitations?.filter(({ accepted_time }) => !accepted_time)
  }, [invitations])

  const currentInvitation = useMemo(() => {
    return activeInvitations?.[activeInvitations?.length - 1]
  }, [activeInvitations])

  const capture = async () => {
    try {
      const uri = await captureRef(couponRef, {
        format: "png",
        quality: 1,
        fileName: "coupon.png",
      })

      const message = `Tandirga kirish uchun kupon: ${currentInvitation?.code}`

      await Share.open({
        url: uri,
        type: "image/png",
        message,
        filename: "coupon.png",
      })
    } catch (error) {}
  }

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
    () => (
      <MaterialSymbols
        shift={2}
        name="featured_seasonal_and_gifts"
        color={theme.colors.background}
      />
    ),
    [theme],
  )

  const ListHeader = useCallback(
    () => (
      <View style={styles.listHeader}>
        {Platform.OS == "ios" ? <View style={styles.headerBackground} /> : null}

        <View style={styles.listHeadeContent}>
          <Text style={styles.listHeaderTitle} variant="titleLarge">
            Tandirni{"\n"}qizdiring 🔥
          </Text>
          <Text style={styles.listHeaderDescription} variant="labelLarge">
            Do'stlaringizni kupon orqali Tandirga taklif qiling! Qayg'urmang,
            kuponlar har hafta berib boriladi, tugab qolmaydi!
          </Text>
          <Divider disableCircles />
          <Divider bottom />
        </View>
      </View>
    ),
    [],
  )

  const _top = top - 8

  return (
    <View
      style={{
        flex: 1,
        paddingTop: _top,
        backgroundColor: "#000000",
      }}>
      <StatusBar
        barStyle={Platform.select({
          ios: "light-content",
        })}
      />

      <View
        style={{
          width: "100%",
          position: "absolute",
          zIndex: 200,
          top: 0,
        }}>
        <View
          style={{
            height: _top,
            width: "100%",
            backgroundColor: "#000000",
          }}
        />
        <LinearGradient
          style={{
            width: "100%",
            height: 32,
          }}
          colors={["#000000", "transparent"]}
        />
      </View>

      <Animated.View
        entering={FadeInUp.delay(500)
          .springify()
          .withInitialValues({
            transform: [
              {
                translateY: -200,
              },
            ],
          })}
        style={styles.extraBackground}
      />

      <View style={styles.body}>
        <Animated.FlatList
          entering={FadeInUp.delay(500)
            .springify()
            .withInitialValues({
              transform: [
                {
                  translateY: -200,
                },
              ],
            })}
          showsVerticalScrollIndicator={false}
          data={invitations}
          renderItem={({ item }) => (
            <Coupon
              item={item}
              onPress={() => {
                const rand = Math.round(Math.random())

                Alert.alert(rand ? "not yet" : "be patient")
              }}
            />
          )}
          keyExtractor={(item) => `${item.code}`}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.card}
        />
      </View>

      {currentInvitation ? (
        <View ref={couponRef} style={styles.currentCouponContainer}>
          <Coupon item={currentInvitation} />
        </View>
      ) : null}

      {currentInvitation ? (
        <Animated.View
          style={styles.giftContainer}
          entering={FadeInDown.delay(900).springify()}>
          <FAB
            elevation={0}
            icon={shareIcon}
            style={styles.gift}
            onPress={capture}
            rippleColor={Color(theme.colors.backdrop).alpha(0.5).toString()}
          />
        </Animated.View>
      ) : null}

      <Animated.View
        style={styles.backContainer}
        entering={FadeInDown.delay(900).springify()}>
        <FAB
          elevation={0}
          icon={backIcon}
          style={styles.back}
          onPress={navigation.goBack}
        />
      </Animated.View>
    </View>
  )
}

export default Gift
