import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { IPreferences } from "../../types"

const usePreferences = () => {
  const getPreferences = async () => {
    const { data } = await api.get("/profile/preferences/")

    return data
  }

  return useQuery<IPreferences>(["preferences"], getPreferences, {
    staleTime: Infinity,
  })
}

export default usePreferences
