export interface OTPFormProps {
  otpInput?: string;
  setOtpInput: (arg: string) => void;
  otpError?: string;
  onOtpSend: () => Promise<boolean>;
  otpSendLoading?: boolean;
  mobileNumber?: string;
  testID?: string;
}
