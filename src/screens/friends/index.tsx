import React, { memo, useCallback, useMemo, useRef, useState } from "react"

import { Portal, PortalProvider } from "@gorhom/portal"
import { useNavigation } from "@react-navigation/native"
import Color from "color"
import { FAB } from "react-native-paper"
import { useSharedValue } from "react-native-reanimated"

import useInvitations from "../../hooks/queries/invitations"

import { useFriendsContext } from "../../components/context/friends"
import { BottomSheetMethods } from "../../components/kit/bottom-sheet"
import MaterialSymbols from "../../components/kit/material-symbols"
import SafeAreaView from "../../components/kit/safe-area-view"
import FriendsList from "../../components/shared/friends-list"
import LanguageSheet from "../../components/shared/language-sheet"
import ScreenHeader from "../../components/shared/screen-header"
import { StackScreenParams } from "../../navigation"
import { IFriend, ILanguage } from "../../types"
import compareProps from "../../utils/compare-props"

import useStyles from "./styles"

type ScreenProps = StackScreenParams<"invitation-code">
const Actions = () => {
  const { styles, theme } = useStyles()

  const { navigate } = useNavigation<ScreenProps>()

  const [open, setOpen] = useState(false)
  const onStateChange = ({ open }: { open: boolean }) => setOpen(open)

  const fabActions = useMemo(
    () => [
      {
        icon: "add",
        label: "Qo'shish",
        onPress: () => navigate("add-friend"),
        style: styles.fab,
        color: theme.colors.onPrimary,
        rippleColor: theme.colors.backdrop,
      },
      {
        icon: "confirmation_number",
        label: "Taklif qilish",
        onPress: () => navigate("gift"),
        color: theme.colors.onPrimary,
        style: styles.fab,
        rippleColor: theme.colors.backdrop,
      },
    ],
    [],
  )

  const fabIcon = useCallback(
    () => (
      <MaterialSymbols
        name="person_add"
        shift={3}
        color={theme.colors.onPrimary}
      />
    ),
    [theme],
  )

  const rippleColor = useMemo(
    () => Color(theme.colors.backdrop).alpha(0.5).toString(),
    [],
  )

  return (
    <PortalProvider>
      <Portal>
        <FAB.Group
          style={styles.fabContainer}
          backdropColor={theme.colors.backdrop}
          fabStyle={styles.fab}
          open={open}
          visible
          icon={fabIcon}
          actions={fabActions}
          onStateChange={onStateChange}
          rippleColor={rippleColor}
        />
      </Portal>
    </PortalProvider>
  )
}

const MemoizedActions = memo(Actions, compareProps([]))

function Friends(): JSX.Element {
  // PREFETCH
  useInvitations(true)

  const { navigate } = useNavigation<ScreenProps>()
  const languageSelect = useRef<BottomSheetMethods>(null)

  const [activeFriend, setActiveFriend] = useState<IFriend>()
  const scrollY = useSharedValue(0)
  const { styles, theme } = useStyles()
  const { sendMatchRequest } = useFriendsContext()

  const onLanguageSelect = useCallback(
    (item: ILanguage) => {
      if (activeFriend) {
        sendMatchRequest(activeFriend, item)
        languageSelect.current?.close()
      }
    },
    [activeFriend],
  )

  const onSendRequest = (item: IFriend) => {
    setActiveFriend(item)
    languageSelect.current?.open()
  }

  const openUserProfile = (item: IFriend) => {
    navigate("user-profile", {
      user_id: item.id,
      first_name: item.first_name,
      last_name: item.last_name,
      date_joined: item.date_joined,
    })
  }

  return (
    <SafeAreaView style={styles.main} edges={["top"]}>
      <ScreenHeader
        titleStyle={{
          lineHeight: 40,
        }}
        scrollY={scrollY}
        title={`Do'stlaringiz`}
      />

      <FriendsList
        scrollY={scrollY}
        onSendRequest={onSendRequest}
        onItemPress={openUserProfile}
      />

      <MemoizedActions />

      <LanguageSheet
        disabledInactive
        ref={languageSelect}
        onSelect={onLanguageSelect}
      />
    </SafeAreaView>
  )
}

export default Friends
