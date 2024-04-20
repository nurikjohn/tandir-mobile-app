import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { IProfile } from "../../types"
import { logOut } from "../mutations/log-out"
import useStorage from "../utils/useStorage"

const fetchData = async () => {
  const { data } = await api.get("/profile/")

  return data
}

const useProfile = () => {
  const [token] = useStorage("token")

  return useQuery<IProfile>(["profile"], fetchData, {
    onError(error) {
      // @ts-expect-error
      if (error?.response?.status == 401) {
        logOut()
      }
    },
    enabled: !!token,
  })
}

export default useProfile
