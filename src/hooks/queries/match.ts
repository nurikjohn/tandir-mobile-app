import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"
import { IChallenge, IMatch } from "../../types"
import shuffle from "../../utils/shuffle"

const useMatch = (matchKey: string) => {
  const getMatch = async () => {
    const oldData = queryClient.getQueryData<IMatch>(["match", matchKey])

    const { data } = await api.get(`/match/confirmed/?key=${matchKey}`)

    const profile = queryClient.getQueryData(["profile"])

    // @ts-expect-error
    if (data.chip.id == profile?.id) {
      data.you = data.chip
      data.opponent = data.dale
    } else {
      data.you = data.dale
      data.opponent = data.chip
    }
    let challenges = data.challenges as IChallenge[]

    challenges = challenges.map((challenge) => {
      const oldOptions = oldData?.challenges.find(
        (item) => item.id == challenge.id,
      )?.options

      if (oldOptions && oldOptions.length == challenge.options.length) {
        challenge.options = oldOptions
      } else {
        challenge.options = shuffle(challenge.options)
      }

      return challenge
    })

    return {
      ...data,
      challenges,
    }
  }

  return useQuery<IMatch>(["match", matchKey], getMatch, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })
}

export default useMatch
