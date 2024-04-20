import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { IState } from "../../types"

const useMatchState = () => {
  const isFocused = useIsFocused()

  const getStatus = async () => {
    const { data } = await api.get<IState>("/current_state/me/")

    return data
  }

  return useQuery<IState>(["status"], getStatus, {
    meta: {
      persist: false,
    },
    enabled: isFocused,
  })
}

export default useMatchState
