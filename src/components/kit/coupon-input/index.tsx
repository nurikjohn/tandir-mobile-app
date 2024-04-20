import { useState } from "react"

import { TextInput, TextInputProps } from "react-native"
import { Text } from "react-native-paper"

import useStyles from "./styles"

interface IProps extends TextInputProps {
  error?: string
}

const CouponInput = ({ value, onChangeText, error }: IProps) => {
  const [focused, setFocused] = useState(false)
  const { styles, theme } = useStyles({ focused, error: !!error })

  return (
    <>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="T4ND1R"
        style={styles.main}
        maxLength={6}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      <Text variant="bodyMedium" style={styles.errorText}>
        {error}
      </Text>
    </>
  )
}

export default CouponInput
