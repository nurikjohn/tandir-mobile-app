import { forwardRef, memo, useCallback } from "react"

import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { Alert } from "react-native"

import useLanguages from "../../../hooks/queries/languages"

import { ILanguage } from "../../../types"
import BottomSheet, { BottomSheetMethods } from "../../kit/bottom-sheet"
import LanguageCard from "../language-card"

import useStyles from "./styles"

type Props = {
  selectedItemId?: number
  onSelect?: (item: ILanguage) => void
  disabledInactive?: boolean
}

const LanguagesList = ({
  disabledInactive,
  onSelect,
  selectedItemId,
}: Props) => {
  const { styles } = useStyles()
  const { data: languages } = useLanguages()

  const renderItem = useCallback(
    ({ index, item }: { item: ILanguage; index: number }) => {
      return (
        <LanguageCard
          disableAnimation
          data={item}
          row={Math.floor(index / 2) + 1}
          onPress={() => onSelect?.(item)}
          containerStyle={styles.itemContainer}
          active={selectedItemId == item.id}
          disabledInactive={disabledInactive}
          onPressInactive={() => {
            Alert.alert(
              `${item.name} ${item.release_progress}% tayyor`,
              "Bu tilga savollar hali to'liq yig'ib bo'linmagan. Savollarning qanchasi tayyor ekanligini kuzatib borishingiz uchun progres bar joylashtirdik, 100% ga yetganida bu til bilan jang tashkillash mumkin bo'ladi",
            )
          }}
        />
      )
    },
    [selectedItemId],
  )

  return (
    <>
      <BottomSheetFlatList
        data={languages}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </>
  )
}

const SheetContent = memo(LanguagesList)

const SNAP_POINTS = ["50%", "85%"]

const LanguageSheet = (props: Props, ref: React.Ref<BottomSheetMethods>) => {
  return (
    <BottomSheet ref={ref} index={0} snapPoints={SNAP_POINTS} enableOverDrag>
      <SheetContent {...props} />
    </BottomSheet>
  )
}

export default memo(forwardRef(LanguageSheet))
