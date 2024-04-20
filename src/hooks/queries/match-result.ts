import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"
import { IMatchResult } from "../../types"

const useMatchResult = (matchKey: string) => {
  const getMatchResult = async () => {
    const { data } = await api.get(`/match/get_match_result/?key=${matchKey}`)

    return data
  }

  return useQuery<IMatchResult>(["match-result", matchKey], getMatchResult, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["match", matchKey],
      })
      queryClient.invalidateQueries({
        queryKey: ["leaderboard"],
      })
    },
    retry: 15000,
    staleTime: Infinity,
  })
}

export default useMatchResult
