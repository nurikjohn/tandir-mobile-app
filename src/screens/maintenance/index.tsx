import React, { useEffect, useMemo, useState } from "react"

import moment from "moment"
import { SafeAreaView, View } from "react-native"
import { Text } from "react-native-paper"

import useServerSate from "../../hooks/queries/server-state"
import useStorage from "../../hooks/utils/useStorage"

import AnimatedTimer from "../../components/shared/animated-timer/intex"
import EmptyPage from "../../components/shared/empty-page"
import { IServerState } from "../../types"

import useStyles from "./styles"

const tvAnimation = require("../../assets/animations/tv.json")

function Maintenance(): JSX.Element {
  const { styles } = useStyles()
  const [savedServerState] = useStorage<IServerState>("server-state")
  const { refetch } = useServerSate()
  const [description, setDescription] = useState("")

  const duration = useMemo(() => {
    if (savedServerState) {
      return moment(savedServerState.to_time * 1000).diff(moment(), "seconds")
    }

    return 0
  }, [savedServerState])

  useEffect(() => {
    if (duration > 86400 * 2) {
      setDescription("Dastur bir necha kundan kegin ishlashni boshlaydi")
    } else if (duration > 86400) {
      setDescription("Dastur ertaga ishlashni boshlaydi")
    } else {
      setDescription("Dastur ishlashiga")
    }
  }, [duration])

  return (
    <SafeAreaView style={styles.main}>
      <EmptyPage
        title="Serverda tuzatish ishlari olib borilmoqda"
        description={description}
        animation={tvAnimation}>
        {duration < 86400 ? (
          <>
            <View key={duration} style={styles.timerBox}>
              <AnimatedTimer
                showHours
                countdown
                duration={duration}
                done={() => {
                  refetch()
                }}
                tick={(_, remaining) => {
                  if (remaining == 5) {
                    refetch()
                  }
                }}
              />
            </View>
            <Text style={styles.description} variant="bodyMedium">
              qoldi
            </Text>
          </>
        ) : null}
      </EmptyPage>
    </SafeAreaView>
  )
}

export default Maintenance
