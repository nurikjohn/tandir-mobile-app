import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { IStats, IStatsPrepared } from "../../types"
import { prepareActivityData } from "../../utils/prepare-activity-data"

const useUserStats = (user_id: number, enabled = true) => {
  const focused = useIsFocused()

  return useQuery<IStatsPrepared>(
    ["user-stats", user_id],
    async () => {
      const { data } = await api.get<IStats>(`/profile/stats/?user=${user_id}`)

      const preparedActivity = prepareActivityData(data.monthly_activity)

      return {
        summary: data.summary,
        monthly_activity: preparedActivity,
      }
    },
    {
      enabled: focused && enabled,
    },
  )
}

export default useUserStats
