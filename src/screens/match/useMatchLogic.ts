import { useEffect, useMemo, useState } from "react"

import { MATCH_DURATION } from "@env"
import moment from "moment"
import { Platform } from "react-native"
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback"

import useAnserChallengeMutation from "../../hooks/mutations/answer-challenge"
import useMatch from "../../hooks/queries/match"
import useMatchProgressSocket from "../../hooks/socket/match-progress"
import useStorage from "../../hooks/utils/useStorage"

import { IMatchAnswer, IMatchState } from "../../types"
import shuffle from "../../utils/shuffle"

type Params = {
  matchKey: string
  onFinish: () => void
}

const useMatchLogic = ({ matchKey, onFinish }: Params) => {
  const { data: match, isLoading } = useMatch(matchKey)
  const answerChallenge = useAnserChallengeMutation(matchKey)
  const [savedState, setSavedState] = useStorage<IMatchState>("match-state")

  const { updateProgress, opponentStep, setOpponentStep } =
    useMatchProgressSocket(
      matchKey,
      savedState?.opponentStep ?? undefined,
      match,
    )

  useEffect(() => {
    if (match && match.is_against_computer) {
      const movement = match.computer_movements[opponentStep - 1]

      if (movement) {
        const timer = setTimeout(() => {
          setOpponentStep((prev) => prev + 1)
        }, movement.time_spent * 1000)

        return () => clearTimeout(timer)
      }
    }
  }, [match, opponentStep])

  const [step, _setStep] = useState(savedState?.step || 1)
  const [startedTime] = useState(savedState?.startedTime || moment().unix())
  const [stepUpdatedTime, setStepUpdatedTime] = useState(
    savedState?.stepUpdatedTime || moment().unix(),
  )

  const [answers, setAnswers] = useState<IMatchAnswer[]>(
    savedState?.answers || [],
  )
  const [selectedOption, setSelectedOption] = useState<number>()

  useEffect(() => {
    const state = {
      step,
      opponentStep,
      answers,
      matchKey,
      startedTime,
      stepUpdatedTime,
    }

    setSavedState(state)
  }, [step, opponentStep, answers, stepUpdatedTime])

  const setStep = (step: number) => {
    let newStep = Math.min(step, 6)

    _setStep(newStep)
    updateProgress(newStep)
  }

  const incrementStep = () => {
    _setStep((prev) => {
      let newStep = Math.min(prev + 1, 6)
      updateProgress(newStep)

      return newStep
    })
    setStepUpdatedTime(moment().unix())
  }

  const challenge = useMemo(() => {
    const _challenge = match?.challenges[step - 1]

    return _challenge
  }, [step, match])

  const challengesCount = useMemo(() => {
    return match?.challenges?.length
  }, [match])

  const isLastStep = useMemo(() => {
    return step == challengesCount
  }, [step, challengesCount])

  const finishMatch = (answers: IMatchAnswer[]) => {
    answerChallenge
      .mutateAsync(answers)
      .then(() => {
        onFinish()
        setSavedState(undefined)
      })
      .catch((error: any) => {
        // setSavedState(undefined)
      })
  }

  const goToNextChallenge = async () => {
    if (!challenge) return

    HapticFeedback.trigger(
      Platform.select({
        android: HapticFeedbackTypes.impactHeavy,
        ios: HapticFeedbackTypes.selection,
      }),
    )

    const _answers = [...answers]

    if (selectedOption) {
      _answers.push({
        challenge_id: challenge.id,
        option_id: selectedOption,
      })

      setAnswers(_answers)
      setSelectedOption(undefined)
    }

    incrementStep()

    if (isLastStep) await finishMatch(_answers)
  }

  const currentStep = useMemo(() => {
    if (savedState) {
      const start = moment(savedState.stepUpdatedTime * 1000)
      const now = moment()

      const supposedProgress =
        savedState.step +
        Math.floor(now.diff(start, "seconds") / MATCH_DURATION)

      console.log("   SAVED: ", savedState.step)
      console.log("SUPPOSED: ", supposedProgress)

      if (supposedProgress > 5) {
        onFinish()
      } else if (supposedProgress > savedState.step) {
        setStep(supposedProgress)
      }

      return supposedProgress
    }

    return step
  }, [])

  const remainingTime = useMemo(() => {
    if (savedState && currentStep == step) {
      const startTime = moment(savedState.stepUpdatedTime * 1000)
      const now = moment()

      const difference = now.diff(startTime) / 1000

      const passedPercent = (difference / MATCH_DURATION) % 1

      return Math.floor(MATCH_DURATION * (1 - passedPercent))
    }

    return MATCH_DURATION
  }, [step])

  return {
    challenge,
    isLoading: isLoading || answerChallenge.isLoading || currentStep > 5,
    step,
    opponentStep,
    goToNextChallenge,
    isLastStep,
    challengesCount,
    selectedOption,
    setSelectedOption,
    remainingTime,
    match,
  }
}

export default useMatchLogic
