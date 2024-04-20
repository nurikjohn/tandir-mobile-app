import React, { memo, useMemo } from "react"

import { ActivityIndicator, Platform, View } from "react-native"
import FastImage, { Source } from "react-native-fast-image"
import { TouchableRipple } from "react-native-paper"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"

import useStyles from "./styles"

interface Props {
  onSelect?: (reactionName: string) => void
}

const Reaction = ({ image, onPress }: { onPress?: any; image: Source }) => {
  const { styles } = useStyles()

  return (
    <View style={styles.reaction}>
      <TouchableRipple onPress={onPress}>
        <View style={styles.animationContainer}>
          <FastImage style={styles.image} source={image} />
        </View>
      </TouchableRipple>
    </View>
  )
}

const MatchResultReactions = ({ onSelect }: Props) => {
  const { styles, theme } = useStyles()

  const animations = useMemo(
    () => [
      {
        name: "clap",
        image: require(`../../../assets/images/clap-reaction.png`),
      },
      {
        name: "explode",
        image: require(`../../../assets/images/explode-reaction.png`),
      },
      // {
      //   name: "think",
      //   image: require(`../../../assets/images/think-reaction.png`),
      // },
      {
        name: "angry",
        image: require(`../../../assets/images/angry-reaction.png`),
      },
      {
        name: "smile",
        image: require(`../../../assets/images/smile-reaction.png`),
      },
      {
        name: "sunglasses",
        image: require(`../../../assets/images/sunglasses-reaction.png`),
      },
    ],
    [],
  )

  return (
    <View>
      <Animated.View
        entering={ZoomIn.delay(100)}
        exiting={ZoomOut}
        style={styles.main}>
        {animations.map(({ image, name }) => (
          <Reaction
            key={name}
            onPress={() => {
              onSelect?.(name)
            }}
            image={image}
          />
        ))}
      </Animated.View>
      <Animated.View
        entering={ZoomIn.delay(50)}
        exiting={ZoomOut.delay(50)}
        style={styles.bubble2}
      />
      <Animated.View
        entering={ZoomIn}
        exiting={ZoomOut.delay(100)}
        style={styles.bubble1}
      />
    </View>
  )
}

export default MatchResultReactions
