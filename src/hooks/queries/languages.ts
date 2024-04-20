import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { ILanguage } from "../../types"

const useLanguages = (isPrefetch: boolean = false) => {
  const getTopics = async () => {
    const { data } = await api.get("/topic/")

    return data
  }

  return useQuery<ILanguage[]>(["languages"], getTopics, {
    refetchOnWindowFocus: isPrefetch ? false : true,
    refetchInterval: false,
  })
}

export default useLanguages
