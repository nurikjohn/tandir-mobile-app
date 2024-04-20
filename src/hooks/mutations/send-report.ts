import { useMutation } from "@tanstack/react-query"

import api from "../../services/api"

const useMatchReportMutation = () => {
  const sendReport = async (variables: {
    match_key: string
    challenge: number
    description: string
    issue_type: string
  }) => {
    const { data } = await api.post("/match/create_report/", variables)

    return data
  }

  return useMutation(sendReport, {
    retry: false,
  })
}

export default useMatchReportMutation
