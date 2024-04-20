import React, { useCallback, useEffect, useMemo, useRef } from "react"

import { Portal } from "@gorhom/portal"
import { useNetInfo } from "@react-native-community/netinfo"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import Color from "color"
import LottieView from "lottie-react-native"
import { ActivityIndicator, View } from "react-native"
import { Badge, FAB, IconButton } from "react-native-paper"
import Animated, { FadeInDown, useSharedValue } from "react-native-reanimated"

import useSearchTicketMutation from "../../hooks/mutations/search-ticket"
import useNotifications from "../../hooks/queries/notifications"
import useProfile from "../../hooks/queries/profile"
import useMatchState from "../../hooks/queries/state"
import useAppState from "../../hooks/utils/useAppState"
import useStorage from "../../hooks/utils/useStorage"

import { BottomSheetMethods } from "../../components/kit/bottom-sheet"
import LottieAnimation from "../../components/kit/lottie-animation"
import MaterialSymbols from "../../components/kit/material-symbols"
import SafeAreaView from "../../components/kit/safe-area-view"
import LanguageSheet from "../../components/shared/language-sheet"
import Leaderboard from "../../components/shared/leaderboard"
import LoadingOverlay from "../../components/shared/loading-overlay"
import ScreenHeader from "../../components/shared/screen-header"
import { StackScreenParams } from "../../navigation"
import queryClient from "../../services/react-query"
import {
  ILanguage,
  ILeaderBoardItem,
  IMatchResultState,
  IMatchState,
} from "../../types"

import useStyles from "./styles"

const highVoltageAnimation = require("../../assets/animations/high_voltage.json")

type ScreenProps = StackScreenParams<"home">

function Home(): JSX.Element {
  const { navigate } = useNavigation<ScreenProps>()

  const fabAnimation = useRef<LottieView>(null)

  const languageSelect = useRef<BottomSheetMethods>(null)
  const scrollY = useSharedValue(0)
  const [matchState] = useStorage<IMatchState>("match-state")
  const [matchResultState] = useStorage<IMatchResultState>("match-result-state")

  const { isConnected } = useNetInfo()

  const { data: profile } = useProfile()
  const { data: notifications } = useNotifications()
  const { data: activeMatch, isLoading } = useMatchState()
  const createSearchTicket = useSearchTicketMutation()

  const isFocused = useIsFocused()

  const { isActive } = useAppState()

  const unreadNotifications = useMemo(() => {
    if (notifications?.length) {
      return notifications.filter(({ is_read }) => !is_read).length
    }

    return 0
  }, [notifications])

  useEffect(() => {
    if (isActive) {
      fabAnimation.current?.play()
    }
  }, [isActive])

  useEffect(() => {
    if (matchState && isFocused) {
      navigate("match", {
        match_key: matchState.matchKey,
      })
    }
  }, [matchState, isFocused])

  useEffect(() => {
    if (matchResultState && isFocused) {
      navigate("match-result", {
        match_key: matchResultState.matchKey,
        robot_finished: false,
      })
    }
  }, [matchResultState, isFocused])

  const canStartMatch = useMemo(() => {
    if (!isConnected) return false

    if (activeMatch) {
      if (activeMatch?.type == "ongoing_match") return false

      return true
    }

    return false
  }, [activeMatch, isConnected])

  const onLanguageSelect = useCallback((item: ILanguage) => {
    if (!createSearchTicket.isLoading)
      createSearchTicket
        .mutateAsync(item.id)
        .then(({ ticket_number }) => {
          languageSelect?.current?.close()

          navigate("match-search", {
            language: item,
            ticket_number,
          })
        })
        .catch(() => {})
  }, [])

  const openLanguageSheet = useCallback(() => {
    languageSelect?.current?.open()
  }, [])

  const { styles, theme } = useStyles({ canStartMatch })

  const thunderIcon = useCallback(
    () =>
      isLoading ? (
        <ActivityIndicator size={24} color={theme.colors.primary} />
      ) : (
        <MaterialSymbols
          name="flash_on"
          shift={2}
          color={
            canStartMatch ? theme.colors.background : theme.colors.onBackground
          }
        />
      ),
    [theme, isLoading, canStartMatch],
  )

  const openNotificationsScreen = () => {
    navigate("notifications")
  }

  const openUserProfile = (item: ILeaderBoardItem) => {
    navigate("user-profile", {
      user_id: item.id,
      first_name: item.first_name,
      last_name: item.last_name,
      date_joined: item.date_joined,
    })
  }

  return (
    <SafeAreaView style={styles.main} edges={["top"]}>
      <ScreenHeader scrollY={scrollY} title={`Salom,\n${profile?.first_name}`}>
        <View
          style={{
            position: "relative",
          }}>
          {unreadNotifications ? (
            <Badge style={styles.notificationsBadge}>
              {unreadNotifications}
            </Badge>
          ) : null}
          <IconButton
            style={styles.notificationsButton}
            icon={() => (
              <MaterialSymbols
                color={theme.colors.onBackground}
                name="notifications"
                shift={0}
              />
            )}
            onPress={openNotificationsScreen}
          />
        </View>
      </ScreenHeader>

      <Leaderboard scrollY={scrollY} onItemPress={openUserProfile} />

      <Animated.View
        style={styles.fabContainer}
        entering={FadeInDown.delay(300).springify()}>
        <FAB
          icon={thunderIcon}
          style={styles.fab}
          onPress={openLanguageSheet}
          disabled={!canStartMatch}
          rippleColor={Color(theme.colors.backdrop).alpha(0.5).toString()}
        />

        {canStartMatch ? (
          <Portal>
            <View
              pointerEvents="none"
              style={[
                styles.voltageAnimation,
                {
                  display: isFocused ? "flex" : "none",
                },
              ]}>
              <LottieAnimation
                ref={fabAnimation}
                source={highVoltageAnimation}
                touchEnabled={false}
                style={styles.animation}
                autoPlay
              />
            </View>
          </Portal>
        ) : null}
      </Animated.View>

      {canStartMatch ? (
        <>
          <LanguageSheet
            disabledInactive
            ref={languageSelect}
            onSelect={onLanguageSelect}
          />
          <LoadingOverlay visible={createSearchTicket.isLoading} />
        </>
      ) : null}
    </SafeAreaView>
  )
}

export default Home
