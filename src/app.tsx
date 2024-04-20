/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect } from "react"

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { PortalProvider } from "@gorhom/portal"
import { QueryClientProvider } from "@tanstack/react-query"
import { StatusBar, Text } from "react-native"
import codePush from "react-native-code-push"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { PaperProvider } from "react-native-paper"
import { SafeAreaProvider } from "react-native-safe-area-context"

import MaterialSymbols, { IconName } from "./components/kit/material-symbols"
import Notch from "./components/kit/notch"
import NetworkInspector from "./components/shared/network-inspector-sheet"
import Navigation from "./navigation"
import {
  notificationsBootstrap,
  useForegroundNotifications,
} from "./services/notifications"
import queryClient from "./services/react-query"
import theme from "./styles/theme"

notificationsBootstrap()

// @ts-expect-error
Text.defaultProps = Text.defaultProps || {}
// @ts-expect-error
Text.defaultProps.allowFontScaling = false

function App(): JSX.Element | null {
  useForegroundNotifications()

  useEffect(() => {
    const example = () => {
      try {
        changeNavigationBarColor(theme.colors.background)
      } catch (e) {}
    }

    example()
  }, [])

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider
            theme={theme}
            settings={{
              icon: ({ name, ...props }) => (
                <MaterialSymbols name={name as IconName} {...props} />
              ),
            }}>
            <StatusBar
              barStyle={"light-content"}
              backgroundColor={theme.colors.background}
            />

            <Notch />

            <PortalProvider>
              <BottomSheetModalProvider>
                <Navigation />

                <NetworkInspector />
              </BottomSheetModalProvider>
            </PortalProvider>
          </PaperProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

const CodePushWrapped = codePush(App)

const Wrapper = ({ isHeadless }: any) => {
  if (isHeadless) return null

  return <CodePushWrapped />
}

export default Wrapper

