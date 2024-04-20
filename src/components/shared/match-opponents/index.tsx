import { GestureResponderEvent, View, ViewStyle } from "react-native"
import { Text } from "react-native-paper"

import LottieAnimation from "../../kit/lottie-animation"
import MaterialIcons from "../../kit/material-symbols"

import useStyles from "./styles"

type Opponent = {
  first_name?: string
  last_name?: string
  rank_score?: number
  confirmed: boolean
  is_robot?: boolean
}

type Props = {
  firstOpponent: Opponent
  secondOpponent: Opponent
  hideRank?: boolean

  style?: ViewStyle
}

const robotAnimation = require("../../../assets/animations/robot.json")

const MatchOpponents = ({
  firstOpponent,
  secondOpponent,
  hideRank = false,
}: Props) => {
  const { styles, theme } = useStyles()

  return (
    <View style={styles.main}>
      <View style={styles.row}>
        <View
          style={[
            styles.left,
            firstOpponent?.confirmed ? null : styles.disabled,
          ]}>
          <Text
            style={styles.leftUserName}
            variant="bodyLarge"
            numberOfLines={2}>
            {firstOpponent.first_name}
          </Text>
          {firstOpponent.last_name ? (
            <Text
              style={styles.leftUserName}
              variant="bodyLarge"
              numberOfLines={2}>
              {firstOpponent.last_name}
            </Text>
          ) : null}
        </View>

        <View style={styles.icon}>
          <MaterialIcons name="flash_on" color={theme.colors.primary} />
        </View>

        <View
          style={[
            styles.right,
            secondOpponent?.confirmed ? null : styles.disabled,
          ]}>
          {secondOpponent.is_robot ? (
            <LottieAnimation
              style={{
                width: 40,
                height: 40,
              }}
              source={robotAnimation}
              autoPlay
            />
          ) : (
            <>
              <Text
                style={styles.rigthUserName}
                variant="bodyLarge"
                numberOfLines={1}>
                {secondOpponent.first_name}
              </Text>
              {secondOpponent.last_name ? (
                <Text
                  style={styles.rigthUserName}
                  variant="bodyLarge"
                  numberOfLines={1}>
                  {secondOpponent.last_name}
                </Text>
              ) : null}
            </>
          )}
        </View>
      </View>

      {hideRank ? null : (
        <View style={styles.rankRow}>
          <View
            style={[
              styles.left,
              firstOpponent?.confirmed ? null : styles.disabled,
            ]}>
            <Text
              style={styles.leftUserName}
              variant="bodyLarge"
              numberOfLines={1}>
              {firstOpponent.rank_score}
            </Text>
          </View>
          <View
            style={[
              styles.right,
              secondOpponent?.confirmed ? null : styles.disabled,
            ]}>
            <Text
              style={styles.rigthUserName}
              variant="bodyLarge"
              numberOfLines={1}>
              {secondOpponent.rank_score}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default MatchOpponents
