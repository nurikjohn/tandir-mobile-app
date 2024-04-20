import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"
import queryClient from "../../services/react-query"
import storage from "../../services/storage"

export const logOut = async () => {
  // remove token from api client
  api.defaults.headers["x-authorization"] = null

  await GoogleSignin.signOut()

  // clear local storage
  storage.clearMemoryCache()
  storage.clearStore()

  return true
}

const useLogOutMutation = () => {
  return useMutation(logOut, {
    onSuccess: () => {
      queryClient.clear()
      queryClient.cancelQueries()
    },
  })
}

export default useLogOutMutation
