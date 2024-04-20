import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { IServerState } from "../../types"

const useServerSate = () => {
  return useQuery<IServerState | null>(
    ["server-state"],
    async () => {
      const { data } = await api.get("/server/")

      return data
    },
    {
      refetchInterval: 10000,
    },
  )
}

export default useServerSate
