import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"
import { ILeaderBoardItem, IProfile } from "../../types"

const getTop = async (): Promise<ILeaderBoardItem[]> => {
  const { data } = await api.get("/rank/top/?n=10")

  return data
}

const getMe = async (): Promise<ILeaderBoardItem[]> => {
  const { data } = await api.get("/rank/me/?neighbors=2")

  return data
}

const useLeaderboard = () => {
  const focused = useIsFocused()

  return useQuery<ILeaderBoardItem[]>(
    ["leaderboard"],
    async () => {
      const profile = queryClient.getQueryData<IProfile>(["profile"])

      const top = await getTop()
      const me = await getMe()

      if (top?.length && profile) {
        let res = []
        const userIsInTop = top.some(({ id }) => id == profile.id)

        if (userIsInTop) res = top
        else {
          res = [
            ...top.slice(0, 5),
            { isDivider: true } as ILeaderBoardItem,
            ...me,
          ]
        }

        return res.map((item) => ({
          ...item,
          is_me: item.id == profile.id,
        }))
      }

      return []
    },
    {
      refetchInterval: 30000,
      enabled: focused,
    },
  )
}

export default useLeaderboard
