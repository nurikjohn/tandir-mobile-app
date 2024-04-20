import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { ICoupon } from "../../types"

const useInvitations = (isPrefetch: boolean = false) => {
  const focused = useIsFocused()

  return useQuery<ICoupon[]>(
    ["invitations"],
    async () => {
      const { data } = await api.get<ICoupon[]>("/profile/invitations/")

      return data
        ?.sort(({ accepted_time }: any) => {
          if (accepted_time) return 1
          return -1
        })
        .filter(({ accepted_time }) => !accepted_time)
    },
    {
      refetchInterval: isPrefetch ? false : 30000,
      enabled: focused,
    },
  )
}

export default useInvitations
