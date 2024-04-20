import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"

import { logOut } from "./log-out"

const useDeleteAccountMutation = () => {
  const deleteAccount = async () => {
    const { data } = await api.post("/profile/delete/")

    return data
  }

  return useMutation(deleteAccount, {
    onSuccess: () => {
      logOut()
    },
  })
}

export default useDeleteAccountMutation
