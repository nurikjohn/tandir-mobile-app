import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet"
import moment from "moment"
import { TextInput, TouchableHighlight, View } from "react-native"
import NetworkLogger, { // @ts-expect-error
  _logger,
  getRequests,
} from "react-native-network-logger"
import NetworkRequestInfo from "react-native-network-logger/lib/typescript/src/NetworkRequestInfo"
import { IconButton, Text, useTheme } from "react-native-paper"
import RNShake from "react-native-shake"

import useStorage from "../../../hooks/utils/useStorage"

import BottomSheet, { BottomSheetMethods } from "../../kit/bottom-sheet"
import Code from "../../kit/code"
import MaterialSymbols from "../../kit/material-symbols"

import useStyles from "./styles"

const SNAP_POINTS = ["95%"]

const NetworkInspectorSheetContent = () => {
  const { styles, theme } = useStyles()

  const [query, setQuery] = useState("")
  const [paused, setPaused] = useState(false)
  const [requests, setRequests] = useState(getRequests())
  const [request, setRequest] = useState<NetworkRequestInfo>()
  const pausedRef = useRef(false)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    _logger?.setCallback((updatedRequests: NetworkRequestInfo[]) => {
      if (!pausedRef.current) {
        setRequests([...updatedRequests])
      }
    })
    _logger?.enableXHRInterception()

    return () => {
      // no-op if component is unmounted
      _logger?.setCallback(() => {})
    }
  }, [])

  const renderItem = useCallback(
    ({ item, index }: { item: NetworkRequestInfo; index: number }) => {
      const time = item.endTime ? item.endTime - item.startTime : "---"

      return (
        <TouchableHighlight
          disabled={!item.endTime}
          underlayColor={theme.colors.surface}
          onPress={() => {
            setRequest(item)
          }}>
          <View style={styles.itemContainer}>
            <View style={styles.leftContainer}>
              <Text variant="titleMedium">{item.method}</Text>
              <Text
                variant="titleMedium"
                style={[
                  styles.status,
                  {
                    backgroundColor:
                      item.status <= 0
                        ? theme.colors.background
                        : item.status < 400
                        ? theme.colors.primary
                        : theme.colors.error,
                    color:
                      item.status <= 0
                        ? theme.colors.onBackground
                        : theme.colors.onPrimary,
                  },
                ]}>
                {item.status > 0 ? item.status : "---"}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <Text variant="bodyMedium">{item.url}</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.time} variant="bodyMedium">
                  {moment(item.startTime).format("HH:mm:ss")}
                </Text>
                <Text style={styles.time} variant="bodyMedium">
                  {time}ms
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      )
    },
    [],
  )

  const filteredRequests = useMemo(() => {
    return requests
      .filter(({ url }) => !url.includes("codepush"))
      .filter(({ url }) => {
        if (!query) return true

        return url.toLowerCase().includes(query.toLowerCase())
      })
  }, [requests, query])

  const requestHeaders = useMemo(() => {
    if (!request) return []

    return Object.keys(request.requestHeaders).map((key) => ({
      key,
      value: request.requestHeaders[key],
    }))
  }, [request])

  const responseHeaders = useMemo(() => {
    if (!request) return []

    return Object.keys(request.responseHeaders).map((key) => ({
      key,
      value: request.responseHeaders[key],
    }))
  }, [request])

  const requestBody = useMemo(() => {
    if (!request?.dataSent) return ""

    try {
      return JSON.stringify(JSON.parse(request.dataSent), null, 4)
    } catch (error) {}

    return request?.dataSent
  }, [request])

  const responseBody = useMemo(() => {
    if (!request?.response) return ""

    try {
      return JSON.stringify(JSON.parse(request.response), null, 4)
    } catch (error) {
      return request?.response.toString()
    }
  }, [request])

  const ListHeader = useCallback(() => {
    const [value, setValue] = useState(query)

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}>
        <TextInput
          value={value}
          onChangeText={(val) => {
            setValue(val)
            setQuery(val)
          }}
          style={{
            flex: 1,
            borderWidth: 2,
            borderColor: theme.colors.surface,
            padding: 12,
            fontSize: 16,
            color: theme.colors.onBackground,
            height: 48,
          }}
          autoCorrect={false}
          autoCapitalize="none"
          maxLength={30}
          cursorColor={theme.colors.primary}
          placeholder="Search"
        />
        <IconButton
          style={{
            margin: 0,
            borderWidth: 2,
            borderColor: paused ? theme.colors.primary : theme.colors.error,
            borderRadius: 0,
            height: 48,
            width: 48,
          }}
          icon={({ color }) => (
            <MaterialSymbols
              name={paused ? "play_arrow" : "pause"}
              shift={0}
              color={paused ? theme.colors.primary : theme.colors.error}
            />
          )}
          onPress={() => setPaused((prev) => !prev)}
        />
      </View>
    )
  }, [paused])

  return (
    <>
      {request ? (
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.body}>
          <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
            <IconButton
              style={{
                margin: 0,
              }}
              icon={({ color }) => (
                <MaterialSymbols name="close" shift={0} color={color} />
              )}
              onPress={() => setRequest(undefined)}
            />
          </View>

          {renderItem({ item: request, index: 0 })}

          {requestHeaders.length ? (
            <View style={{}}>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "600",
                  marginLeft: 4,
                  marginTop: 8,
                }}>
                Request headers
              </Text>
              <View
                style={{
                  marginTop: 4,
                  padding: 16,

                  gap: 4,
                  borderWidth: 2,
                  borderColor: theme.colors.surface,
                }}>
                {requestHeaders.map(({ key, value }) => (
                  <Text
                    key={key}
                    variant="labelMedium"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                    }}>
                    <Text
                      variant="labelMedium"
                      style={{
                        fontWeight: "600",
                      }}>
                      {key}
                    </Text>
                    : {value}
                  </Text>
                ))}
              </View>
            </View>
          ) : null}

          {request.dataSent ? (
            <View>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "600",
                  marginLeft: 4,
                  marginTop: 8,
                  marginBottom: 4,
                }}>
                Request body
              </Text>
              <Code language={"json"} code={requestBody} />
            </View>
          ) : null}

          {responseHeaders.length ? (
            <View style={{}}>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "600",
                  marginLeft: 4,
                  marginTop: 8,
                }}>
                Response headers
              </Text>
              <View
                style={{
                  marginTop: 4,
                  padding: 16,
                  gap: 4,
                  borderWidth: 2,
                  borderColor: theme.colors.surface,
                }}>
                {responseHeaders.map(({ key, value }) => (
                  <Text
                    key={key}
                    variant="labelMedium"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                    }}>
                    <Text
                      variant="labelMedium"
                      style={{
                        fontWeight: "600",
                      }}>
                      {key}
                    </Text>
                    : {value}
                  </Text>
                ))}
              </View>
            </View>
          ) : null}

          {request.response ? (
            <View>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "600",
                  marginLeft: 4,
                  marginTop: 8,
                  marginBottom: 4,
                }}>
                Response body
              </Text>
              <Code language={"json"} code={responseBody} />
            </View>
          ) : null}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetFlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.body}
          data={filteredRequests}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
        />
      )}
      {/* <NetworkLogger /> */}
    </>
  )
}

const NetworkInspector = () => {
  const [networkInspectorEnabled] = useStorage<boolean>(
    "network-inspector-enabled",
  )
  const loggerSheet = useRef<BottomSheetMethods>(null)
  const theme = useTheme()

  useEffect(() => {
    if (networkInspectorEnabled) {
      const subscription = RNShake.addListener(() => {
        loggerSheet?.current?.open()
      })

      return () => {
        subscription.remove()
      }
    }
  }, [networkInspectorEnabled])

  if (!networkInspectorEnabled) {
    return null
  }

  return (
    <BottomSheet
      backgroundStyle={{
        backgroundColor: theme.colors.background,
      }}
      ref={loggerSheet}
      index={0}
      snapPoints={SNAP_POINTS}
      enableOverDrag>
      <NetworkInspectorSheetContent />
    </BottomSheet>
  )
}

export default memo(NetworkInspector)
