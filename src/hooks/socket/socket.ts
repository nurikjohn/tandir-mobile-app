import { useEffect, useRef, useState } from "react"

import DeviceInfo from "react-native-device-info"

import useProfile from "../queries/profile"
import useAppState from "../utils/useAppState"
import useStorage from "../utils/useStorage"

const useSocket = (
  url: string,
  name?: string,
  handler?: (event: WebSocketMessageEvent) => void,
  enabled: boolean = true,
) => {
  const [token] = useStorage("token")
  const { isActive } = useAppState()
  const socket = useRef<WebSocket | null>(null)
  const shouldReconnect = useRef(false)
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectCount, setReconnectCount] = useState(0)
  const { data: profile } = useProfile()

  useEffect(() => {
    if (isActive && enabled) {
      connect()

      const interval = setInterval(() => {
        if (socket.current && socket.current.readyState == WebSocket.OPEN) {
          send({ ping: "cat" })
        } else if (shouldReconnect.current) {
          console.log("RECONNECTING")
          setReconnectCount((prev) => prev + 1)

          connect()
        }
      }, 5000)

      return () => {
        // 1]. close socket
        disconnect()

        // 2]. clear timers
        clearInterval(interval)
      }
    }
  }, [isActive, enabled])

  const connect = () => {
    if (socket.current) {
      socket.current?.close?.()
    }

    socket.current = new WebSocket(url, null, {
      headers: {
        authorization: `Token ${token}`,
      },
    })

    socket.current.onopen = () => {
      console.log(`[SOCKET]: CONNECTED (${name})`)

      setIsConnected(true)
      setReconnectCount(0)
      shouldReconnect.current = false
    }

    socket.current.onclose = ({ code }) => {
      console.log(`[SOCKET]: DISCONNECTED (${name})`)

      if (code == 1000) {
        shouldReconnect.current = false
      } else {
        shouldReconnect.current = true
      }
      setIsConnected(false)
    }

    socket.current.onmessage = handler ?? null
  }

  const disconnect = () => {
    socket.current?.close()
  }

  const send = (data: Record<string, any>) => {
    if (socket.current?.readyState == WebSocket.OPEN) {
      const message = JSON.stringify(data)

      socket.current.send(message)
    }
  }

  return {
    socket,
    isConnected,
    reconnectCount,
    send,
    connect,
    disconnect,
  }
}

export default useSocket
