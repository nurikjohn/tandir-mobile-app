import { useEffect } from "react"

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
} from "@notifee/react-native"
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging"
import moment from "moment"
import { Platform } from "react-native"

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail
})

const onMessageReceived = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  let channelId

  if (Platform.OS == "android") {
    channelId = await notifee.createChannel({
      id: "important",
      name: "Important Notifications",
      badge: false,
      importance: AndroidImportance.HIGH,
      lights: true,
      vibration: true,
      visibility: AndroidVisibility.PUBLIC,
      sound: "default",
    })
  }

  if (message.data?.type == "ping") {
    const sent_time = moment(message.data?.time)
    const now = moment()
    const diff = now.utc(false).diff(sent_time) / 1000

    if (diff < 60 * 5) {
      const first_name = message.data.first_name

      notifee.displayNotification({
        title: `⚡️ Jang vaqti!`,
        body: `${first_name} sizni Tandirga chorlamoqda, uzoq kuttirmang!`,
        android: {
          channelId: channelId ?? undefined,
          pressAction: {
            id: "default",
          },
          sound: "default",
          importance: AndroidImportance.HIGH,
          timestamp: sent_time.unix() * 1000,
          showTimestamp: true,
          timeoutAfter: 60 * 5 * 1000,
        },
        ios: {
          interruptionLevel: "timeSensitive",
          sound: "default",
        },
      })
    }
  } else if (message.notification) {
    notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId: channelId ?? undefined,
        pressAction: {
          id: "default",
        },
        sound: "default",
        importance: AndroidImportance.HIGH,
        timestamp: +(message.sentTime || 0),
        showTimestamp: true,
      },
      ios: {
        interruptionLevel: "timeSensitive",
        sound: "default",
      },
    })
  } else if (message.data?.type == "notification") {
    const { title, short_description } = message.data
    notifee.displayNotification({
      title: title as string,
      body: short_description as string,
      android: {
        channelId: channelId ?? undefined,
        pressAction: {
          id: "default",
        },
        sound: "default",
        importance: AndroidImportance.HIGH,
      },
      ios: {
        interruptionLevel: "timeSensitive",
        sound: "default",
      },
      data: message.data,
    })
  }
}

export const notificationsBootstrap = async () => {
  messaging().onTokenRefresh((token) => {
    // enablePush({ registration_id: token })
  })
}

export const requestUserPermission = async () => {
  const response = await notifee.requestPermission()

  if (response.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    const token = await messaging().getToken()

    return token
  }

  return null
}

messaging().setBackgroundMessageHandler(onMessageReceived)

export const useForegroundNotifications = () => {
  useEffect(() => {
    const unsub = messaging().onMessage(onMessageReceived)
    return () => unsub()
  }, [])
}
