import { useEffect, useRef } from "react"

import Sound from "react-native-sound"

type SoundSource = "opponent_found_sound" | "countdown_8_bit" | "fireworks"

const useSound = (source: SoundSource, volume?: number) => {
  const sound = useRef<Sound>()

  useEffect(() => {
    Sound.setCategory("Ambient", true)
    sound.current = new Sound(`${source}.mp3`, Sound.MAIN_BUNDLE, (err) => {
      if (!err) {
        // if (volume) sound.current?.setVolume(volume / 10)
      }
    })

    return () => {
      sound.current?.release()
    }
  }, [])

  const play = (onEnd?: (success: boolean) => void) => {
    sound.current?.play(onEnd)
  }

  const stop = () => {
    console.log("asd")

    sound.current?.stop()
  }

  return {
    play,
    stop,
  }
}

export default useSound
