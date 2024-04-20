import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"

const useActivateProfileMutation = () => {
  const activateProfile = async (variables: { code: string }) => {
    const { data } = await api.post("/profile/activate/", variables)

    return data
  }

  return useMutation(activateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"])
    },
  })
}

export default useActivateProfileMutation
