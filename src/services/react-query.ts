import NetInfo from "@react-native-community/netinfo"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient, focusManager } from "@tanstack/react-query"
import { onlineManager } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { AppState, AppStateStatus } from "react-native"

import storage from "./storage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: 3,
      retryDelay(failureCount, error) {
        return failureCount * 1000
      },
    },
    mutations: {
      retry: 3,
      retryDelay(failureCount, error) {
        return failureCount * 1000
      },
    },
  },
})

const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.setItem(key, value)
  },
  getItem: (key: string) => {
    const value = storage.getString(key)
    return value === undefined ? null : value
  },
  removeItem: (key: string) => {
    storage.removeItem(key)
  },
}

const persister = createSyncStoragePersister({ storage: mmkvStorage })

persistQueryClient({
  queryClient,
  persister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const queryIsReadyForPersistance = query.state.status === "success"

      if (queryIsReadyForPersistance) {
        const { meta } = query

        const excludeFromPersisting = !(meta?.persist ?? true)
        return !excludeFromPersisting
      }

      return queryIsReadyForPersistance
    },
  },
})

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

focusManager.setEventListener((setFocused) => {
  const sub = AppState.addEventListener("change", (status: AppStateStatus) => {
    setFocused(status === "active")
  })

  return sub.remove
})

export default queryClient
