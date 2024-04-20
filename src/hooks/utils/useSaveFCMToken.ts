import { useEffect } from "react"

import { stringMd5 } from "react-native-quick-md5"

import { requestUserPermission } from "../../services/notifications"
import useEnablePushNotifications from "../mutations/fcm-subscribe"
import useProfile from "../queries/profile"

const useSaveFCMToken = () => {
  const { data: profile } = useProfile()
  const { mutateAsync } = useEnablePushNotifications()

  // Request notification access
  useEffect(() => {
    if (profile) {
      requestUserPermission().then((token: string | null) => {
        if (token) {
          if (profile.is_push_enabled) {
            const hash = stringMd5(token)

            if (hash == profile.push_hash) {
              return
            }
          }

          mutateAsync({ registration_id: token })
        }
      })
    }
  }, [profile])
}

export default useSaveFCMToken
