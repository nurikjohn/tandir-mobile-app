import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"
import { IFriend, IProfile } from "../../types"

const useFriends = (isPrefetch: boolean = false) => {
  const focused = useIsFocused()

  return useQuery<IFriend[]>(
    ["friends"],
    async () => {
      const profile = queryClient.getQueryData<IProfile>(["profile"])

      const { data } = await api.get<{ results: IFriend[] }>(
        "/profile/friends/?size=100",
      )

      return data?.results?.map((item, index) => ({
        ...item,
        rank_number: index + 1,
        is_me: item.id == profile?.id,
      }))
    },
    {
      refetchInterval: isPrefetch ? false : 30000,
      enabled: focused,
    },
  )
}

export default useFriends
