import { useQuery } from "@tanstack/react-query"

import api from "../../services/api"
import { IContacts } from "../../types"

const useContacts = () => {
  const getContacts = async () => {
    const { data } = await api.get("/contact_channels/")

    return data
  }

  return useQuery<IContacts>(["contacts"], getContacts, {
    refetchInterval: false,
  })
}

export default useContacts
