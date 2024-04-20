import { useEffect, useRef, useState } from "react"

import { useClock } from "@shopify/react-native-skia"
import { TextStyle } from "react-native"
import Animated, {
  FadeInUp,
  FadeOutDown,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated"

import useStyles from "./styles"

type Props = {
  duration?: number
  countdown?: boolean
  tick?: (ellapsed: number, remaining: number) => void
  done?: () => void
  showHours?: boolean
  style?: TextStyle
}

const AnimatedTimer = ({
  tick,
  done,
  countdown,
  duration,
  showHours = false,
  style,
}: Props) => {
  const clock = useClock()
  const { styles } = useStyles()
  const [timePassed, setTimePassed] = useState(0)
  const [hours, setHours] = useState<string[]>(showHours ? ["0", "0"] : [])
  const [minutes, setMinutes] = useState(["0", "0"])
  const [seconds, setSeconds] = useState(["0", "0"])
  const alreadyDone = useRef(false)

  useAnimatedReaction(
    () => {
      return clock.value / 1000
    },
    (clock) => {
      runOnJS(setTimePassed)(Math.floor(clock))
    },
    [clock],
  )

  useEffect(() => {
    let ellapsed = timePassed
    let remaining = 0

    if (duration) {
      remaining = duration - timePassed
    }
    if (countdown) {
      ellapsed = remaining
    }

    if (remaining < 0) {
      if (!alreadyDone.current) {
        alreadyDone.current = true
        done?.()

        setHours(showHours ? ["0", "0"] : [])
        setMinutes(["0", "0"])
        setSeconds(["0", "0"])
      }

      return
    } else {
      alreadyDone.current = false
    }

    const hours = Math.floor(ellapsed / 3600)
    const minutes = Math.floor((ellapsed % 3600) / 60)
    const seconds = Math.floor(ellapsed % 60)

    if (hours > 0 || showHours) {
      setHours(hours.toString().padStart(2, "0").split(""))
    } else {
      setHours([])
    }
    setMinutes(minutes.toString().padStart(2, "0").split(""))
    setSeconds(seconds.toString().padStart(2, "0").split(""))

    tick?.(timePassed, countdown ? ellapsed : Infinity)
  }, [timePassed])

  return (
    <Animated.View
      style={{
        flexDirection: "row",
      }}>
      {hours.map((minute, index) => (
        <Animated.Text
          key={`seconds_${index}_${minute}`}
          style={[styles.text, style]}
          entering={FadeInUp.springify()}
          exiting={FadeOutDown.duration(100)}>
          {minute}
        </Animated.Text>
      ))}
      {hours.length ? (
        <Animated.Text style={[styles.text, style]}>:</Animated.Text>
      ) : null}
      {minutes.map((minute, index) => (
        <Animated.Text
          key={`seconds_${index}_${minute}`}
          style={[styles.text, style]}
          entering={FadeInUp.springify()}
          exiting={FadeOutDown.duration(100)}>
          {minute}
        </Animated.Text>
      ))}
      <Animated.Text style={[styles.text, style]}>:</Animated.Text>
      {seconds.map((second, index) => (
        <Animated.Text
          key={`seconds_${index}_${second}`}
          style={[styles.text, style]}
          entering={FadeInUp.springify()}
          exiting={FadeOutDown.duration(100)}>
          {second}
        </Animated.Text>
      ))}
    </Animated.View>
  )
}

export default AnimatedTimer
