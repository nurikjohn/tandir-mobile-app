import { View, ViewStyle } from "react-native"
import { Text } from "react-native-paper"

import MaterialSymbols, { IconName } from "../../kit/material-symbols"

import useStyles from "./styles"

interface Props {
  icon: IconName
  value: number
  description: string
  unit?: string
  style?: ViewStyle
}

const StatsBox = ({ style, icon, value, description, unit }: Props) => {
  const { theme, styles } = useStyles()

  return (
    <View style={[styles.main, style]}>
      <MaterialSymbols name={icon} color={theme.colors.primary} />
      <View style={styles.content}>
        <Text variant="headlineMedium">
          {value}
          {unit ? <Text variant="labelLarge">{unit}</Text> : null}
        </Text>

        <Text variant="labelLarge">{description}</Text>
      </View>
    </View>
  )
}

export default StatsBox
