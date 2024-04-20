import React, { useEffect, useMemo } from "react"

import notifee, { EventType } from "@notifee/react-native"
import { NavigationContainer, RouteProp, Theme } from "@react-navigation/native"
import { createNavigationContainerRef } from "@react-navigation/native"
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack"
import moment from "moment"
import { useTheme } from "react-native-paper"

import AddFriend from "../screens/add-friend"
import Auth from "../screens/auth"
import Experiment from "../screens/experiment"
import Gift from "../screens/gift"
import InvitationCode from "../screens/invitation-code"
import Maintenance from "../screens/maintenance"
import Match from "../screens/match"
import MatchReport from "../screens/match-report"
import MatchResult from "../screens/match-result"
import MatchResultReview from "../screens/match-result-review"
import MatchSearch from "../screens/match-search"
import Notification from "../screens/notification"
import Notifications from "../screens/notifications"
import Settings from "../screens/settings"
import UserProfile from "../screens/user-profile"

import useFriends from "../hooks/queries/friends"
import useLanguages from "../hooks/queries/languages"
import useProfile from "../hooks/queries/profile"
import useServerSate from "../hooks/queries/server-state"
import useSaveFCMToken from "../hooks/utils/useSaveFCMToken"
import useStorage from "../hooks/utils/useStorage"

import FriendsContextProvider from "../components/context/friends"
import MatchRequestSheet from "../components/shared/match-request-sheet"
import { ILanguage, IServerState } from "../types"

import BottomTabNavigation from "./bottom-tabs"

export type RootStackParamList = {
  auth: undefined
  "invitation-code": undefined
  language: { userId: string }
  _main: undefined
  "tab-navigator": undefined
  home: undefined
  settings: undefined
  "match-search": {
    language: ILanguage
    ticket_number: number
    with_cooldown?: boolean
  }
  match: { match_key: string }
  "match-result": { match_key: string; robot_finished: boolean }
  "match-result-review": { match_key: string }
  "match-report": { match_key: string; challenge_id: number }
  gift: undefined
  "add-friend": undefined
  notifications: undefined
  notification: {
    notification_id: number
  }
  "user-profile": {
    user_id: number
    first_name: string
    last_name: string
    date_joined: number
  }
  maintenance: undefined
  experiment: undefined
}

export type StackScreenParams<RouteName extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, RouteName>

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>

const Stack = createNativeStackNavigator<RootStackParamList>()

export const navigationRef = createNavigationContainerRef()

notifee.onForegroundEvent(async ({ type, detail }) => {
  const { notification } = detail

  if (type == EventType.PRESS && notification) {
    if (notification.data?.type == "notification") {
      navigate("notification", {
        notification_id: notification.data?.id as number,
      })
    }
  }
})

export function navigate<K extends keyof RootStackParamList>(
  name: K,
  params: RootStackParamList[K],
) {
  if (navigationRef.isReady()) {
    const currentRoute = navigationRef.getCurrentRoute()

    const state = navigationRef.getState()

    if (currentRoute?.name == "match-search") {
      const rs = state.routes[0].state

      rs?.routes.pop()
      rs?.routes.push({
        key: name,
        name,
        params,
      })

      navigationRef.reset({
        ...state,
        routes: [
          {
            ...state.routes[0],
            state: rs,
          },
        ],
      })
    }

    // @ts-expect-error
    navigationRef.navigate(name, params)
  }
}

const MainNavigations = () => {
  // PREFETCH
  useFriends(true)
  useLanguages(true)

  // Send FCM token to backend
  useSaveFCMToken()

  return (
    <FriendsContextProvider>
      <Stack.Navigator
        // initialRouteName="experiment"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
        }}>
        <Stack.Screen name="tab-navigator" component={BottomTabNavigation} />
        <Stack.Screen
          name="match-search"
          options={{
            gestureEnabled: false,
          }}
          component={MatchSearch}
        />
        <Stack.Screen
          name="match"
          options={{
            gestureEnabled: false,
          }}
          component={Match}
        />
        <Stack.Screen
          name="match-result"
          component={MatchResult}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="match-result-review"
          component={MatchResultReview}
        />
        <Stack.Screen
          name="match-report"
          component={MatchReport}
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen name="gift" component={Gift} />
        <Stack.Screen
          name="add-friend"
          component={AddFriend}
          options={{
            presentation: "modal",
          }}
        />

        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen name="notifications" component={Notifications} />
        <Stack.Screen name="notification" component={Notification} />
        <Stack.Screen name="user-profile" component={UserProfile} />

        <Stack.Screen name="experiment" component={Experiment} />
      </Stack.Navigator>
      <MatchRequestSheet />
    </FriendsContextProvider>
  )
}

function Navigation() {
  const theme = useTheme()
  const [savedServerState, setSavedServerState] =
    useStorage<IServerState>("server-state")
  const [token, setToken] = useStorage("token")
  const { data: profile, isLoading } = useProfile()
  const { data: serverState } = useServerSate()

  const profileActivated = profile?.invitation

  useEffect(() => {
    if (serverState) setSavedServerState(serverState)
  }, [serverState])

  const inMaintenance = useMemo(() => {
    const state = savedServerState

    if (state) {
      const now = moment()
      const startTime = moment(state.from_time * 1000)
      const endTime = moment(state.to_time * 1000)

      if (state.state == "maintenance") {
        if (endTime.isBefore(now)) return false

        return true
      } else if (state.state == "pending_maintenance") {
        if (startTime.isBefore(now) && endTime.isAfter(now)) return true
      }
    }

    return false
  }, [savedServerState])

  if (token && !profile && isLoading) return null

  return (
    <NavigationContainer ref={navigationRef} theme={theme as unknown as Theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: false,
        }}>
        {inMaintenance ? (
          <Stack.Screen name="maintenance" component={Maintenance} />
        ) : !token ? (
          <Stack.Screen name="auth" component={Auth} />
        ) : !profileActivated ? (
          <Stack.Screen name="invitation-code" component={InvitationCode} />
        ) : (
          <Stack.Screen name="_main" component={MainNavigations} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
