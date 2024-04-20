import { memo } from "react"

import { AnimationObject } from "lottie-react-native"
import { View } from "react-native"
import { Text } from "react-native-paper"

import compareProps from "../../../utils/compare-props"
import LottieAnimation from "../../kit/lottie-animation"

import useStyles from "./styles"

type Props = {
  title: string
  description: string
  children?: any
  animation?:
    | string
    | AnimationObject
    | {
        uri: string
      }
}

const EmptyPage = ({ title, description, animation, children }: Props) => {
  const { styles } = useStyles()

  return (
    <View style={styles.main}>
      {animation ? (
        <LottieAnimation
          instant
          autoPlay
          source={animation}
          style={styles.animation}
        />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title} variant="titleMedium">
          {title}
        </Text>
        <Text style={styles.description} variant="bodyMedium">
          {description}
        </Text>
        {children}
      </View>
    </View>
  )
}

export default EmptyPage
