import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"
import storage from "../../services/storage"
import { IProfile } from "../../types"

const useGoogleAuthMutation = () => {
  const signInWithGoogle = async (idToken: string) => {
    const { data } = await api.post("/auth/google_authentication/", {
      id_token: idToken,
    })

    return data
  }

  return useMutation(signInWithGoogle, {
    onSuccess(data: { token: string; user: IProfile }) {
      if (data.user) queryClient.setQueryData(["profile"], data.user)

      if (data.token) storage.setString("token", data.token)
    },
  })
}

export default useGoogleAuthMutation
