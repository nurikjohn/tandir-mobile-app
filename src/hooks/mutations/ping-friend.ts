import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"

const usePingFriendMutation = () => {
  const pingFriend = async (variables: { friend_id: number }) => {
    const { data } = await api.post("/profile/ping/", variables)

    return data
  }

  return useMutation(pingFriend, {
    onError: (err) => {},
  })
}

export default usePingFriendMutation
