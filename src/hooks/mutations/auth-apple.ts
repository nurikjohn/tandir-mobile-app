import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"
import storage from "../../services/storage"
import { IProfile } from "../../types"

const useAppleAuthMutation = () => {
  const signInWithApple = async ({
    id_token,
    first_name,
    last_name,
  }: {
    id_token: string
    first_name?: string
    last_name?: string
  }) => {
    const { data } = await api.post("/auth/apple_authentication/", {
      id_token,
      first_name,
      last_name,
    })

    return data
  }

  return useMutation(signInWithApple, {
    onSuccess(data: { token: string; user: IProfile }) {
      if (data.user) queryClient.setQueryData(["profile"], data.user)

      if (data.token) storage.setString("token", data.token)
    },
    onError: ({ response }) => {},
  })
}

export default useAppleAuthMutation
