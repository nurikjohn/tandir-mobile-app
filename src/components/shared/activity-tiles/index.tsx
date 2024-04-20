import { memo, useEffect, useState } from "react"

import moment from "moment"
import { ActivityIndicator, Platform, View } from "react-native"
import { Text } from "react-native-paper"

import { IMonthlyActivityPrepared } from "../../../types"
import compareProps from "../../../utils/compare-props"
import ActivityTile from "../activity-tile"

import useStyles from "./styles"

interface Props {
  data: IMonthlyActivityPrepared[]
}

const WEEKDAYS = ["D", "S", "Ch", "P", "J", "Sh", "Y"]

const ActivityTiles = ({ data }: Props) => {
  const { styles, theme } = useStyles()

  const [selectedItem, setSelectedItem] = useState<string>()

  useEffect(() => {
    if (selectedItem) {
      const timer = setTimeout(() => {
        setSelectedItem(undefined)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [selectedItem])

  return (
    <View style={styles.main}>
      <View style={styles.row}>
        {WEEKDAYS.map((name) => (
          <View key={name} style={styles.weekdayName}>
            <Text variant="titleMedium" style={styles.weekdayNameText}>
              {name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.tilesContainer}>
        {data.length ? (
          <View style={styles.row}>
            {data.map((cell: any, index: number) => {
              return (
                <ActivityTile
                  key={cell.date}
                  data={cell}
                  index={index}
                  active={selectedItem == cell.date}
                  onPress={() => {
                    setSelectedItem(cell.date)
                  }}
                />
              )
            })}
          </View>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator
              size={Platform.select({ android: "large", default: "small" })}
              color={theme.colors.primary}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default memo(ActivityTiles, compareProps(["data"]))
