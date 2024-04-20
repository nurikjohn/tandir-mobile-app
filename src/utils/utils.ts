export const degreeToRad = (degree: number) => {
  "worklet"

  return degree * (Math.PI / 180)
}

export const convertSecondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  let result = ""

  if (hours > 0) {
    result += `${hours} soat `
  }

  if (minutes > 0 || hours > 0) {
    result += `${minutes} daqiqa `
  }

  if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
    result += `${remainingSeconds} soniya `
  }

  return result.trim()
}
