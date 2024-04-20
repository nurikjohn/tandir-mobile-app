import React, { useEffect, useMemo } from "react"

import { useNavigation, useRoute } from "@react-navigation/native"
import moment from "moment"
import {
  ActivityIndicator,
  Alert,
  Linking,
  View,
  useWindowDimensions,
} from "react-native"
import { Text } from "react-native-paper"
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"
import RenderHTML, {
  MixedStyleDeclaration,
  defaultSystemFonts,
} from "react-native-render-html"

import useReadNotification from "../../hooks/mutations/read-notification"
import useNotification from "../../hooks/queries/notification"

import SafeAreaView from "../../components/kit/safe-area-view"
import ScreenHeader from "../../components/shared/screen-header"
import { RootRouteProps } from "../../navigation"
import fontConfig, {
  FONT_BOLD,
  FONT_MEDIUM,
  FONT_REGULAR,
  FONT_ULTRABOLD,
} from "../../styles/typography"

import useStyles from "./styles"

type RouteProps = RootRouteProps<"notification">

const Notification = (): JSX.Element => {
  const { styles, theme } = useStyles()
  const { goBack } = useNavigation()
  const { params } = useRoute<RouteProps>()
  const scrollY = useSharedValue(0)
  const { width, height } = useWindowDimensions()
  const { data: notification, isLoading } = useNotification(
    params.notification_id,
  )
  const { mutateAsync: markNotificationAsRead } = useReadNotification(
    params.notification_id,
  )

  useEffect(() => {
    if (notification && !notification.is_read) {
      markNotificationAsRead()
    }
  }, [notification])

  const systemFonts = useMemo(
    () => [
      FONT_REGULAR,
      FONT_MEDIUM,
      FONT_BOLD,
      FONT_ULTRABOLD,
      ...defaultSystemFonts,
    ],
    [],
  )

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert(`Xatolik yuz berdi qayta urunib ko'ring`)
    }
  }

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const tagsStyles = useMemo(
    () =>
      ({
        body: {
          margin: 0,
          color: theme.colors.onBackground,
          fontFamily: FONT_REGULAR,
        },
        p: {
          padding: 0,
          paddingBottom: 8,
          margin: 0,
          color: theme.colors.onBackground,
          ...fontConfig.bodyMedium,
        },
        ul: {
          padding: 0,
          margin: 0,
          marginLeft: 8,
          color: theme.colors.onBackground,
        },
        ol: {
          padding: 0,
          margin: 0,
          marginLeft: 8,
          color: theme.colors.onBackground,
        },
        li: {
          padding: 0,
          margin: 0,
          marginLeft: 8,
          color: theme.colors.onBackground,
        },
        a: {
          padding: 0,
          margin: 0,
          color: theme.colors.primary,
          textDecorationLine: "none",
          ...fontConfig.bodyMedium,
        },
        img: {
          paddingBottom: 16,
        },
      } as Record<string, MixedStyleDeclaration>),
    [theme],
  )

  const renderersProps = useMemo(() => {
    return {
      a: {
        onPress: (event: any, url: any) => {
          openLink?.(url)
        },
      },
    }
  }, [])

  const formatedDate = useMemo(() => {
    if (notification) {
      return moment(notification.published_time * 1000).format("DD.MM.YY HH:mm")
    }

    return null
  }, [notification])

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader
        action={() => goBack()}
        actionIcon="arrow_back"
        title=""
        scrollY={scrollY}
      />

      {notification ? (
        <Animated.ScrollView
          onScroll={scrollHandler}
          contentContainerStyle={{
            paddingTop: 8,
            paddingHorizontal: 16,
            paddingBottom: 120,
            gap: 16,
            minHeight: height,
          }}
          showsVerticalScrollIndicator={false}>
          <View>
            <Text variant="headlineMedium" style={{ lineHeight: 36 }}>
              {notification.title}
            </Text>
            <Text
              variant="labelMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
              }}>
              {formatedDate}
            </Text>
          </View>

          <RenderHTML
            contentWidth={width}
            source={{
              html: notification.body,
            }}
            tagsStyles={tagsStyles}
            systemFonts={systemFonts}
            renderersProps={renderersProps}
          />
        </Animated.ScrollView>
      ) : isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 120,
          }}>
          <ActivityIndicator size={"large"} color={theme.colors.primary} />
        </View>
      ) : null}
    </SafeAreaView>
  )
}

export default Notification
