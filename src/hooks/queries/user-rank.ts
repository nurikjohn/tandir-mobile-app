import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"

const useUserRank = (user_id: number, enabled = true) => {
  const focused = useIsFocused()

  return useQuery<{ rank: number; score: number }>(
    ["user-rank", user_id],
    async () => {
      const { data } = await api.get(`/rank/user_rank/?user=${user_id}`)

      return data
    },
    {
      enabled: enabled && focused,
    },
  )
}

export default useUserRank
