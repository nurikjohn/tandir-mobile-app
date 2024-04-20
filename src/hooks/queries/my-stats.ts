import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { IStats, IStatsPrepared } from "../../types"
import { prepareActivityData } from "../../utils/prepare-activity-data"

const useMyStats = () => {
  const focused = useIsFocused()

  return useQuery<IStatsPrepared>(
    ["my-stats"],
    async () => {
      const { data } = await api.get<IStats>("/profile/stats/")

      const preparedActivity = prepareActivityData(data.monthly_activity)

      return {
        summary: data.summary,
        monthly_activity: preparedActivity,
      }
    },
    {
      enabled: focused,
    },
  )
}

export default useMyStats
