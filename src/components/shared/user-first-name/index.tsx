import { memo } from "react"

import { View } from "react-native"
import { Text } from "react-native-paper"

import compareProps from "../../../utils/compare-props"

import useStyles from "./styles"

type Props = {
  name: string
}

const UserFirstName = ({ name }: Props) => {
  const { styles } = useStyles()

  return (
    <View style={styles.main}>
      <Text numberOfLines={1} variant="titleSmall" style={styles.text}>
        {name}
      </Text>
    </View>
  )
}

export default memo(UserFirstName, compareProps<Props>(["name"]))
