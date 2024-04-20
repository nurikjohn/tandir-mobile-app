import React, { useCallback } from "react"

import { FlashList } from "@shopify/flash-list"
import { View } from "react-native"

import SafeAreaView from "../../components/kit/safe-area-view"

import useStyles from "./styles"

const data = new Array(5).fill(0)

const Experiment = (): JSX.Element => {
  const { styles } = useStyles()

  const renderItem = useCallback(() => {
    return <View style={{ flexDirection: "row" }}></View>
  }, [])

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlashList
        data={data}
        estimatedItemSize={32}
        numColumns={10}
        renderItem={renderItem}
      />
    </SafeAreaView>
  )
}

export default Experiment
