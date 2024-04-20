import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { EventEmitter } from "eventemitter3"
import { Alert, Platform } from "react-native"

import config from "../../config"
import { navigate } from "../../navigation"
import queryClient from "../../services/react-query"
import { IFriend, ILanguage, IMatchRequest } from "../../types"

import useSocket from "./socket"

type Events =
  | "match-request"
  | "match-request-sent"
  | "match-request-received"
  | "match-request-errored"
  | "match-request-rejected"
  | "match-request-accepted"

export type FriendsEventEmitter = EventEmitter<Events>

export const emitter = new EventEmitter<Events>()

export const FRIEND_MATCH_REQUEST_TIMEOUT = 30

const useFriendsSocket = () => {
  const url = `${config.socketURL}/ws/friends`

  const handler = useCallback(({ data }: WebSocketMessageEvent) => {
    try {
      data = JSON.parse(data)

      if (data?.error) {
        if (data.sender_id) {
          emitter.emit("match-request-errored", data.sender_id)
        }

        Alert.alert("Xatolik yuz berdi", data?.error)
      }

      if (data?.type == "status_update") {
        queryClient.setQueryData(["friends"], (prev: any) => {
          return prev.map((friend: IFriend) => {
            if (friend.id == data?.message?.user_id) {
              return {
                ...friend,
                status: data?.message?.status,
                last_beat: data?.message?.last_beat,
              }
            }

            return friend
          })
        })
      } else if (data?.type == "challenge_friend") {
        const challenger = data?.message?.challenger
        const language = data?.message?.topic

        if (challenger && language) {
          const request = {
            challenger: {
              ...challenger,
              rank_number: challenger.standing,
            },
            language,
            request_id: data?.message.request_id,
          }

          if (hasOngoingMatch.current) {
            rejectMatchRequest(request)
          } else {
            emitter.emit("match-request", request)
            sendMatchRequestProcessing(request)
          }
        }
      } else if (data?.type == "reviewing_challenge") {
        emitter.emit("match-request-received", data.message.friend)
      } else if (data?.type == "challenge_confirmed") {
        emitter.emit("match-request-accepted")
        navigate("match", { match_key: data?.message?.match_key })
      } else if (data?.type == "decline_challenge") {
        emitter.emit("match-request-rejected", data.message.declined_by)
      }
    } catch (error) {}
  }, [])

  const { socket, isConnected, send, reconnectCount } = useSocket(
    url,
    "FRIENDS",
    handler,
  )

  const hasOngoingMatch = useRef(false)
  const [processingRequest, setProcessingRequest] = useState<IMatchRequest>()

  useEffect(() => {
    if (processingRequest) {
      const timer = setTimeout(() => {
        rejectMatchRequest(processingRequest)
      }, FRIEND_MATCH_REQUEST_TIMEOUT * 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [processingRequest])

  const sendMatchRequest = (friend: IFriend, language: ILanguage) => {
    const reply_id = new Date().getTime().toString()

    const data = {
      action: "challenge_friend",
      message: {
        friend_id: friend.id,
        topic_id: language.id,
        reply_id,
      },
    }

    send(data)
    emitter.emit("match-request-sent", friend)
  }

  const sendMatchRequestProcessing = (request: IMatchRequest) => {
    const data = {
      action: "reviewing_challenge",
      message: {
        request_id: request.request_id,
      },
    }

    send(data)
    setProcessingRequest(request)
  }

  const acceptMatchRequest = (request: IMatchRequest) => {
    const data = {
      action: "accept_challenge",
      message: {
        request_id: request.request_id,
      },
    }

    send(data)
  }

  const rejectMatchRequest = (request: IMatchRequest) => {
    const data = {
      action: "decline_challenge",
      message: {
        request_id: request.request_id,
      },
    }

    send(data)
    setProcessingRequest(undefined)
  }

  const val = useMemo(() => {
    return {
      emitter,
      socket,
      isConnected,

      sendMatchRequest,
      acceptMatchRequest,
      rejectMatchRequest,

      hasOngoingMatch,
      reconnectCount,
    }
  }, [isConnected, reconnectCount])

  return val
}

export default useFriendsSocket
