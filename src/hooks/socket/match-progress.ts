import { useEffect, useRef, useState } from "react"

import { getUseOfValueInStyleWarning } from "react-native-reanimated"

import config from "../../config"
import { IMatch } from "../../types"
import useMatchState from "../queries/state"

import useSocket from "./socket"

const normalizeOpponentStep = (step: number) => Math.max(Math.min(step, 6), 1)

const useMatchProgressSocket = (
  matchKey: string,
  initialOpponentStep: number = 1,
  match?: IMatch,
) => {
  const url = `${config.socketURL}/ws/match?key=${matchKey}`
  const { send } = useSocket(url, "MATCH-PROGRESS", handler)

  const [isFinished, setIsFinished] = useState(false)
  const [myReaction, setMyReaction] = useState<string>()
  const [opponentReaction, setOpponentReaction] = useState<string>()
  const [opponentStep, _setOpponentStep] = useState(
    normalizeOpponentStep(initialOpponentStep ?? 1),
  )
  const { data: matchState } = useMatchState()

  const setOpponentStep = (val: number | ((prev: number) => number)) => {
    _setOpponentStep((prev) => {
      if (typeof val == "function") {
        const newVal = val(prev)
        return normalizeOpponentStep(newVal)
      }

      return normalizeOpponentStep(val)
    })
  }

  useEffect(() => {
    if (matchState && !match?.is_against_computer) {
      setOpponentStep(matchState.current_opponent_step)
    }
  }, [matchState, match])

  function handler({ data }: WebSocketMessageEvent) {
    data = JSON.parse(data)

    switch (data.type) {
      case "match_status":
        if (data.message == "finished") {
          setIsFinished(true)
        }

        break

      case "match_progress_update":
        setOpponentStep(data.message.current_challenge_number)

        break

      case "match_finished":
        setIsFinished(true)

        break

      case "send_reaction":
        setOpponentReaction(data.message.reaction)

        break
    }
  }

  const updateProgress = (step: number) => {
    try {
      const data = {
        action: "match_progress_update",
        message: step,
      }

      send(data)
    } catch (error) {}
  }

  const sendReaction = (reaction: string) => {
    try {
      const data = {
        action: "send_reaction",
        message: { reaction },
      }

      setMyReaction(reaction)

      send(data)
    } catch (error) {}
  }

  return {
    isFinished,
    opponentStep,
    updateProgress,
    setOpponentStep,
    opponentReaction,
    setOpponentReaction,
    myReaction,
    setMyReaction,
    sendReaction,
  }
}

export default useMatchProgressSocket
