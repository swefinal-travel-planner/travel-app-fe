import { useThemeStyle } from '@/hooks/useThemeStyle'
import React, { useMemo } from 'react'
import { OtpInput } from 'react-native-otp-entry'
import { createStyles } from './styles'

interface OtpFieldProps {
  onChanged?: (otp: string) => void
  onFilled?: (otp: string) => void
}

const OtpField: React.FC<OtpFieldProps> = ({ onChanged, onFilled }) => {
  const theme = useThemeStyle()
  const styles = useMemo(() => createStyles(theme), [theme])

  return (
    <OtpInput
      numberOfDigits={6}
      focusColor="#3F6453"
      autoFocus={true}
      hideStick={true}
      blurOnFilled={true}
      disabled={false}
      type="numeric"
      secureTextEntry={false}
      onFilled={onFilled}
      onTextChange={onChanged}
      theme={{
        pinCodeContainerStyle: styles.pinCodeContainer,
        pinCodeTextStyle: styles.pinCodeText,
        focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
      }}
    />
  )
}

export default OtpField
