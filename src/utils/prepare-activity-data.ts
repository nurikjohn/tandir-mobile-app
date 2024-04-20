import moment from "moment"

import { IMonthlyActivity, IMonthlyActivityPrepared } from "../types"

let dataPointsCount = 28
let dataPoints = new Array(dataPointsCount).fill(0)

const formatDate = (date: Date) => {
  return date.toLocaleDateString("uz", {
    month: "long",
    day: "numeric",
  })
}

export const prepareActivityData = (
  data: IMonthlyActivity[],
): IMonthlyActivityPrepared[] => {
  const now = moment().startOf("day")

  const maxMatchesCount = Math.max(...data.map(({ matches }) => matches))
  const weekday = now.weekday()

  const start = moment()
    .startOf("day")
    .subtract(dataPointsCount - ((7 - weekday) % 7), "days")

  const results = dataPoints.map((_, index) => {
    const date = start.add(1, "days")
    const dateStr = date.format("YYYY-MM-DD")

    const _data = data.find(({ date }) => date == dateStr)

    const diff = date.diff(now, "days")
    const is_today = diff == 0
    const shown = diff > 0 ? false : true

    if (_data) {
      return {
        date: formatDate(date.toDate()),
        activity: _data.matches / maxMatchesCount,
        matches: _data.matches,
        is_today,
        shown,
      }
    }

    return {
      date: formatDate(date.toDate()),
      activity: 0,
      matches: 0,
      is_today,
      shown,
    }
  })

  return results
}
