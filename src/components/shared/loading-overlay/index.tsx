import { memo } from "react"

import { Portal } from "@gorhom/portal"
import { ActivityIndicator, View } from "react-native"

import compareProps from "../../../utils/compare-props"

import useStyles from "./styles"

type Props = {
  visible: boolean
}

const LoadingOverlay = ({ visible }: Props) => {
  const { styles, theme } = useStyles()

  if (!visible) return null

  return (
    <Portal>
      <View style={styles.main}>
        <View style={styles.card}>
          <ActivityIndicator color={theme.colors.onSurface} />
        </View>
      </View>
    </Portal>
  )
}

export default memo(LoadingOverlay, compareProps(["visible"]))
