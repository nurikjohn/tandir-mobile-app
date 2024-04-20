import { useMemo } from "react"

import {
  BottomTabBarProps,
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import { CommonActions, RouteProp } from "@react-navigation/native"
import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"
import { ifIphoneX } from "react-native-iphone-x-helper"
import { BottomNavigation, useTheme } from "react-native-paper"

import Friends from "../screens/friends"
import Home from "../screens/home"
import Profile from "../screens/profile"

import MaterialSymbols from "../components/kit/material-symbols"

export type BottomTabParamList = {
  home: undefined
  friends: undefined
  profile: undefined
}

export type BottomTabScreenParams<RouteName extends keyof BottomTabParamList> =
  BottomTabNavigationProp<BottomTabParamList, RouteName>

export type BottomTabRouteProps<RouteName extends keyof BottomTabParamList> =
  RouteProp<BottomTabParamList, RouteName>

const Tab = createBottomTabNavigator<BottomTabParamList>()

const CustomTabBar = ({
  navigation,
  state,
  descriptors,
  insets,
}: BottomTabBarProps) => {
  return (
    <BottomNavigation.Bar
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        })

        if (event.defaultPrevented) {
          preventDefault()
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          })
        }
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key]
        if (options.tabBarIcon) {
          return options.tabBarIcon({ focused, color, size: 24 })
        }

        return null
      }}
      labeled={false}
    />
  )
}

const BottomTabNavigation = () => {
  const theme = useTheme()

  const screenOptions = useMemo(() => {
    return {
      headerShown: false,
      tabBarShowLabel: false,
      tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      tabBarStyle: {
        borderTopColor: theme.colors.surface,
        borderTopWidth: 2,
        height: Platform.select({
          ios: DeviceInfo.hasDynamicIsland() ? 88 : ifIphoneX(88, 72),
          android: 56,
        }),
        paddingTop: 0,
        backgroundColor: theme.colors.background,
      },
    }
  }, [theme])

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <MaterialSymbols name="home" size={size} color={color} />
          },
        }}
      />
      <Tab.Screen
        name="friends"
        component={Friends}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <MaterialSymbols name="group" size={size} color={color} />
          },
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialSymbols
                name="account_circle"
                size={size}
                color={color}
              />
            )
          },
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigation
