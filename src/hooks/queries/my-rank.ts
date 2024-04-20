import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { ILeaderBoardItem } from "../../types"

const getMe = async (): Promise<ILeaderBoardItem[]> => {
  const { data } = await api.get("/rank/me/?neighbors=0")

  return data
}

const useMyRank = () => {
  const focused = useIsFocused()

  return useQuery<ILeaderBoardItem>(
    ["my-rank"],
    async () => {
      const me = await getMe()

      return me[0]
    },
    {
      enabled: focused,
    },
  )
}

export default useMyRank
