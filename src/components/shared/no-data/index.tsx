import React, { memo } from "react"

import { ActivityIndicator, Platform, View } from "react-native"

import LottieAnimation from "../../kit/lottie-animation"

import useStyles from "./styles"

const webAnimation = require("../../../assets/animations/spider_web.json")

interface Props {
  loading: boolean
  hasData: boolean
  children: React.ReactNode
}

const NoData = ({ loading, hasData, children }: Props) => {
  const { styles, theme } = useStyles()

  if (hasData) {
    return <>{children}</>
  }

  return (
    <View style={styles.main}>
      {loading ? (
        <ActivityIndicator
          size={Platform.select({ android: "large", ios: "small" })}
          color={theme.colors.primary}
        />
      ) : (
        <LottieAnimation
          style={styles.animation}
          source={webAnimation}
          autoPlay
        />
      )}
    </View>
  )
}

export default NoData
