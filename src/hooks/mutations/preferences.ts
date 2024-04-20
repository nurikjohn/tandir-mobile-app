import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"

const usePreferencesMutation = () => {
  const changePreferences = async (preferences: object) => {
    const { data } = await api.put("/profile/preferences/", preferences)

    return { data }
  }

  return useMutation(changePreferences, {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(["preferences"])
    },
  })
}

export default usePreferencesMutation
