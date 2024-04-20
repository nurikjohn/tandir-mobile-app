import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"

export const enablePush = async (variables: { registration_id: string }) => {
  const { data } = await api.post("/profile/enable_push/", variables)

  return data
}

const useEnablePushNotifications = () => {
  return useMutation(enablePush)
}

export default useEnablePushNotifications
