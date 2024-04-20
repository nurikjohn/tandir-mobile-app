import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"

const useMatchWithRobotMutation = () => {
  const matchWithRobot = async (variables: { topic: number }) => {
    const { data } = await api.post("/match/matrix/", variables)

    return data
  }

  return useMutation(matchWithRobot)
}

export default useMatchWithRobotMutation
