import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { INotification } from "../../types"

const useNotification = (id: number) => {
  return useQuery<INotification>(["notifications", id], async () => {
    const { data } = await api.get(`/notification/${id}/`)

    return data
  })
}

export default useNotification
