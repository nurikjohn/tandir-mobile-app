import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"

const useAddFriendMutation = () => {
  const addFriend = async (variables: { code: string }) => {
    const { data } = await api.post("/profile/add_friend/", variables)

    return data
  }

  return useMutation(addFriend, {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"])
    },
    retry: false,
  })
}

export default useAddFriendMutation
