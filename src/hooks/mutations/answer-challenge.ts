import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"

const useAnserChallengeMutation = (matchKey: string) => {
  const answerChallenge = async (responses: object[]) => {
    const { data } = await api.post("/match/apply_answers/", {
      key: matchKey,
      responses,
    })

    return data
  }

  return useMutation(answerChallenge, {
    retry: true,
    retryDelay: 1000,
  })
}

export default useAnserChallengeMutation
