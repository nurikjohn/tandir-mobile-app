import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"

const useReadNotification = (id: number) => {
  const readNotification = async () => {
    const { data } = await api.post(`/notification/${id}/mark_as_read/`)

    return data
  }

  return useMutation(readNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
    },
    retry: true,
    retryDelay: 1000,
  })
}

export default useReadNotification
