import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"

const useProfileMutation = () => {
  const updateProfile = async (profile: object) => {
    const { data } = await api.put("/profile/edit/", profile)

    return data
  }

  return useMutation(updateProfile, {
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data)
      queryClient.invalidateQueries(["profile"])
      queryClient.invalidateQueries(["leaderboard"])
    },
  })
}

export default useProfileMutation
