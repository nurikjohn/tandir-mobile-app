import { Easing, withDelay, withTiming } from "react-native-reanimated"

export const CustomEnteringAnimation = (
  delay: number,
  duration: number = 2500,
) => {
  return () => {
    "worklet"

    const easing = Easing.elastic(1.3)
    const animations = {
      opacity: withDelay(delay, withTiming(1, { duration })),
      transform: [
        {
          scale: withDelay(delay, withTiming(1, { duration, easing })),
        },
      ],
    }

    const initialValues = {
      opacity: 0,
      transform: [{ scale: 0 }],
    }

    const callback = (finished: boolean) => {
      // optional callback that will fire when layout animation ends
    }

    return {
      initialValues,
      animations,
      callback,
    }
  }
}
