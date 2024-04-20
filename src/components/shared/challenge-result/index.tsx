import { useMemo } from "react"

import { View } from "react-native"
import { Text } from "react-native-paper"

import { IMatch, IMatchResult, IResponse } from "../../../types"
import MaterialIcons, { IconName } from "../../kit/material-symbols"

import useStyles from "./styles"

interface Props {
  result: IMatchResult
  match: IMatch
  challengeNumber: number
  challengeId: number
}

const ChallangeResult = ({
  result,
  challengeNumber,
  challengeId,
  match,
}: Props) => {
  const { styles, theme } = useStyles()

  const opponentResponse = useMemo(() => {
    let res: any = result.opponent_responses?.find(
      ({ challenge_id }) => challenge_id == challengeId,
    )

    if (!res && match.is_against_computer) {
      res = match.computer_movements[challengeNumber - 1]
    }

    return res
  }, [result, match, challengeId])

  const yourResponse = useMemo(() => {
    return result.your_responses?.find(
      ({ challenge_id }) => challenge_id == challengeId,
    )
  }, [result, challengeId])

  const getIconProps = (response?: IResponse) => {
    if (!response)
      return {
        name: "block" as IconName,
        color: theme.colors.onSurface,
      }

    if (response.is_correct)
      return {
        name: "done" as IconName,
        color: theme.colors.primary,
      }

    return {
      name: "close" as IconName,
      color: theme.colors.error,
    }
  }

  return (
    <View style={styles.main}>
      <MaterialIcons {...getIconProps(yourResponse)} />

      <Text variant="bodyMedium">{challengeNumber}</Text>

      <MaterialIcons {...getIconProps(opponentResponse)} />
    </View>
  )
}
export default ChallangeResult
