import { useEffect, useState } from "react"

import { AppState, Platform } from "react-native"

type AppStateType = "active" | "inactive" | "background"

const useAppState = () => {
  const [state, setState] = useState<AppStateType>()
  const [prevState, setPrevState] = useState<AppStateType>()
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    function onHandleAppStateChange(nextAppState: string) {
      setState(nextAppState as AppStateType)
    }

    const stateListener = AppState.addEventListener(
      "change",
      onHandleAppStateChange,
    )

    return () => {
      stateListener?.remove()
    }
  }, [])

  useEffect(() => {
    const inactive = Platform.select({
      ios: "inactive",
      android: "background",
    })

    if (state == inactive) {
      setPrevState(state)
      setIsActive(false)
    } else if (state == "active" && prevState == inactive) {
      setPrevState(state)
      setIsActive(true)
    }
  }, [state])

  return { state, isActive }
}

export default useAppState
