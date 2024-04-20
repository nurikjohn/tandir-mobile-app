import { useEffect, useState } from "react"

import config from "../../config"
import { ILanguage, IProfile } from "../../types"
import useMatchWithRobotMutation from "../mutations/robot-match"
import useProfile from "../queries/profile"

import useSocket from "./socket"

export enum SearchStatus {
  CONNECTING,
  SEARCHING,
  WAITING_CONFIRMATION,
  WAITING_OPPONENT,
}

const useMatchSearchSocket = (
  ticket_number: Number,
  language: ILanguage,
  with_cooldown?: boolean,
) => {
  const { data: profile } = useProfile()
  const url = `${config.socketURL}/ws/search?ticket=${ticket_number}`
  const { send, connect, disconnect, isConnected } = useSocket(
    url,
    "MATCH-SEARCH",
    handler,
    !with_cooldown,
  )

  const { mutateAsync: createRobotMatch, isLoading } =
    useMatchWithRobotMutation()

  const [matchFound, setMatchFound] = useState(false)
  const [opponentConfirmed, setOpponentConfirmed] = useState(false)
  const [waitingOpponent, setWaitingOpponent] = useState(false)
  const [matchConfirmed, setMatchConfirmed] = useState(false)
  const [opponent, setOpponent] = useState<IProfile>()
  const [confirmationCode, setConfirmationCode] = useState<string>()
  const [matchKey, setMatchKey] = useState<string>()
  const [cooldown, setCooldown] = useState(with_cooldown)
  const [isPenalty, setIsPenalty] = useState(false)

  function handler({ data }: WebSocketMessageEvent) {
    data = JSON.parse(data)

    switch (data.type) {
      case "opponent_found":
        setMatchFound(true)

        const opponent = data.message.fighter
        setOpponent(opponent)
        setConfirmationCode(data.message.confirmation_code)
        break

      case "match_confirmed":
        setMatchConfirmed(true)
        setMatchKey(data.message.match_key)
        break

      case "opponent_confirmed":
        setOpponentConfirmed(true)
        break

      // case "opponent_exited_search":
      //   reset(false)
      //   reconnect()
      //   break
    }
  }

  const confirm = () => {
    const data = {
      action: "confirm_code",
      message: confirmationCode,
    }

    send(data)
    setWaitingOpponent(true)
  }

  const reset = (penalty = true) => {
    setMatchFound(false)
    setOpponentConfirmed(false)
    setWaitingOpponent(false)
    setMatchConfirmed(false)
    setOpponent(undefined)
    setConfirmationCode(undefined)
    setMatchKey(undefined)

    if (penalty && !waitingOpponent) {
      setCooldown(true)
      setIsPenalty(true)
    } else {
      reconnect()
    }
  }

  const reconnect = () => {
    setCooldown(false)
    connect()
  }

  const matchWithRobot = async () => {
    const data = await createRobotMatch({ topic: language.id })
    setMatchConfirmed(true)
    setMatchKey(data.match_key)
  }

  return {
    matchFound,
    opponentConfirmed,
    waitingOpponent,
    matchConfirmed,
    opponent,
    confirm,
    matchKey,
    reset,
    matchWithRobot,
    isLoading,
    reconnect,
    disconnect,
    cooldown,
    isPenalty,
    isConnected,
  }
}

export default useMatchSearchSocket
