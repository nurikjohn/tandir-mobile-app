import { ReactNode, createContext, useContext } from "react"

import useFriendsSocket, {
  FriendsEventEmitter,
} from "../../../hooks/socket/friends"

import { IFriend, ILanguage, IMatchRequest } from "../../../types"

interface FriendsContextValue {
  emitter: FriendsEventEmitter
  socket: React.MutableRefObject<WebSocket | null>
  sendMatchRequest: (friend: IFriend, language: ILanguage) => void
  acceptMatchRequest: (request: IMatchRequest) => void
  rejectMatchRequest: (request: IMatchRequest) => void

  isConnected: boolean
  reconnectCount: number
  hasOngoingMatch: React.MutableRefObject<boolean>
}

// @ts-expect-error
const FriendsContext = createContext<FriendsContextValue>()

const FriendsContextProvider = ({ children }: { children: ReactNode }) => {
  const socket = useFriendsSocket()

  return (
    <FriendsContext.Provider value={socket}>{children}</FriendsContext.Provider>
  )
}

export const useFriendsContext = () => {
  return useContext(FriendsContext)
}

export default FriendsContextProvider
