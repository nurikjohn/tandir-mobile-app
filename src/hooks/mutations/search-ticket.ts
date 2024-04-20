import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"

const useSearchTicketMutation = () => {
  const createSearchTicket = async (topic: number) => {
    const { data } = await api.post("/search_ticket/", {
      topic_id: topic,
    })

    return data
  }

  return useMutation(createSearchTicket)
}

export default useSearchTicketMutation
