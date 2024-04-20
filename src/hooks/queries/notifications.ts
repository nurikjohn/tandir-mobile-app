import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { INotification } from "../../types"

const useNotifications = () => {
  return useQuery<INotification[]>(["notifications"], async () => {
    const { data } = await api.get("/notification/")

    return data.results
  })
}

export default useNotifications
