import { forwardRef, memo, useMemo } from "react"

import {
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet"
import { Alert, Linking, View } from "react-native"
import FastImage from "react-native-fast-image"
import { Text } from "react-native-paper"
import Animated from "react-native-reanimated"

import useContacts from "../../../hooks/queries/contacts"

import BottomSheet, { BottomSheetMethods } from "../../kit/bottom-sheet"
import MaterialSymbols, { IconName } from "../../kit/material-symbols"
import Pressable from "../../kit/pressable"

import useStyles from "./styles"

const Contacts = () => {
  const { styles, theme } = useStyles()
  const { data: contacts } = useContacts()

  const contactItems = useMemo(() => {
    return [
      {
        title: "Tandir",
        image: require("../../../assets/images/channel-image.png"),
        subtitle: "Telegram kanalga qo'shilish",
        url: contacts?.tg_channel_link,
        icon: "campaign" as IconName,
      },
      {
        title: "Tandir [beta]",
        image: require("../../../assets/images/beta-group-image.png"),
        subtitle: "Beta guruhga qo'shilish",
        url: contacts?.tg_beta_group_link,
        icon: "group" as IconName,
      },
    ]
  }, [contacts])

  const openURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      Alert.alert(`Xatolik yuz berdi qayta urunib ko'ring`)
    }
  }

  return (
    <BottomSheetView style={styles.main}>
      {contactItems.map(({ title, subtitle, icon, image, url }) => (
        <Pressable onPress={url ? () => openURL(url) : undefined}>
          <View style={styles.listItem}>
            <FastImage source={image} style={styles.image} />
            <View style={styles.content}>
              <Text
                style={styles.title}
                numberOfLines={1}
                variant="titleMedium">
                {title}
              </Text>
              <Text
                style={styles.subtitle}
                numberOfLines={1}
                variant="labelMedium">
                {subtitle}
              </Text>
            </View>

            <MaterialSymbols
              shift={0}
              name={icon}
              color={theme.colors.onBackground}
            />
          </View>
        </Pressable>
      ))}
    </BottomSheetView>
  )
}

const SheetContent = memo(Contacts)

const ContactsSheet = ({}, ref: React.Ref<BottomSheetMethods>) => {
  const snapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints)

  return (
    <BottomSheet
      ref={ref}
      index={0}
      // @ts-expect-error
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enableOverDrag>
      <BottomSheetView onLayout={handleContentLayout}>
        <SheetContent />
      </BottomSheetView>
    </BottomSheet>
  )
}

export default memo(forwardRef(ContactsSheet))
