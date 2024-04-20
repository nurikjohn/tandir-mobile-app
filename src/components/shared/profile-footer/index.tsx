import { memo, useMemo } from "react"

import moment from "moment"
import { View } from "react-native"
import { Text } from "react-native-paper"

import compareProps from "../../../utils/compare-props"
import BrailleDots from "../../kit/braille-dots"
import MaterialSymbols from "../../kit/material-symbols"

import useStyles from "./styles"

interface Props {
  date: number
}

const ProfileFooter = ({ date }: Props) => {
  const { theme, styles } = useStyles()

  const formatedDate = useMemo(() => {
    return moment(date * 1000).format("DD.MM.YY")
  }, [date])

  return (
    <View style={styles.main}>
      <View
        style={{
          flexDirection: "row",
        }}>
        <View style={styles.signature}>
          <Text variant="labelSmall" style={styles.text}>
            TNDR
          </Text>
        </View>
        <View style={styles.egg}>
          <BrailleDots color={theme.colors.surface} />
        </View>
        <View style={styles.date}>
          <Text variant="labelSmall" style={styles.text}>
            {formatedDate}
          </Text>
        </View>
      </View>

      <View style={styles.logo}>
        <MaterialSymbols
          shift={-1}
          name="flash_on"
          color={theme.colors.surface}
        />
      </View>
    </View>
  )
}

export default memo(ProfileFooter, compareProps(["date"]))
