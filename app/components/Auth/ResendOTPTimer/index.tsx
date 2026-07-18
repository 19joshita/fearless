import React, {useState, useEffect, useRef, FC} from 'react';
import {TouchableOpacity, AppState} from 'react-native';
import {ResendOTPTimerProps} from './types';
import {AppLabel} from '@components';
import styles from './styles';
import {COLORS, FONT_FAMILY, FONT_VARIENTS} from '@theme';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {useText} from '@localization';

/**
 * ResendOTPTimer - A component for handling OTP resend functionality with a countdown timer
 * Continues counting even when app is in background state
 *
 * @param {Object} props
 * @param {number} props.initialSeconds - Initial countdown time in seconds (default: 60)
 * @param {number} props.maxResends - Maximum number of allowed resends (default: 3)
 * @param {Function} props.onResendPress - Callback function triggered when resend is pressed
 * @param {boolean} props.isPending - Flag to indicate if an API call is in progress (default: false)
 * @param {Object} props.style - Additional style for the container
 * @param {Object} props.textStyle - Style for the text elements
 * @param {Object} props.buttonStyle - Style for the resend button
 * @param {Object} props.buttonTextStyle - Style for the resend button text
 */
const ResendOTPTimer: FC<ResendOTPTimerProps> = ({
  initialSeconds = 60,
  maxResends = 5,
  onResendPress,
  isPending = false,
  style,
  textStyle,
  buttonStyle,
  buttonTextStyle,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [resendCount, setResendCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const {TEXT} = useText();

  // References to track time when app goes to background
  const appState = useRef(AppState.currentState);
  const timeoutStartRef = useRef(Date.now());
  const secondsLeftRef = useRef(initialSeconds);

  const _layout = LinearTransition.springify().damping(14);

  // Sync ref with state for use in AppState callback
  useEffect(() => {
    secondsLeftRef.current = seconds;
  }, [seconds]);

  // Handle timer logic
  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      interval && clearInterval(interval);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [isActive, seconds]);

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        if (isActive && secondsLeftRef.current > 0) {
          const now = Date.now();
          const timeElapsed = Math.floor(
            (now - timeoutStartRef.current) / 1000,
          );

          // Calculate remaining time
          const newSeconds = Math.max(0, secondsLeftRef.current - timeElapsed);
          setSeconds(newSeconds);

          // If time ran out while in background
          if (newSeconds === 0) {
            setIsActive(false);
          }
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App is going to the background
        timeoutStartRef.current = Date.now();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  const handleResend = async () => {
    if (isPending || resendCount >= maxResends || isActive) return;

    // Call the parent's resend callback
    const isSent = onResendPress ? await onResendPress() : false;

    if (isSent) {
      // Increment resend count
      setResendCount(prevCount => prevCount + 1);

      // Reset timer
      setSeconds(initialSeconds);
      setIsActive(true);
    }
  };

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const canResend = !isActive && resendCount < maxResends && !isPending;
  const resendText = isPending ? TEXT.SENDING : TEXT.RESEND_CODE_SMS;
  const resendAttemptsText =
    maxResends - resendCount > 0
      ? `(${maxResends - resendCount} ${
          maxResends - resendCount === 1
            ? TEXT.ATTEMPT_SINGULAR
            : TEXT.ATTEMPT_PLURAL
        } left)`
      : '';

  return (
    <Animated.View layout={_layout}>
      <TouchableOpacity
        onPress={handleResend}
        disabled={!canResend}
        style={[styles.resendContainer, {opacity: isActive ? 0.6 : 1}]}>
        <AppLabel
          fontSize={FONT_VARIENTS.p}
          fontFamily={FONT_FAMILY.Semibold}
          color={COLORS.SECONDARY_COLOR}
          textStyle={{
            textDecorationLine: isActive || isPending ? undefined : 'underline',
          }}
          text={
            isActive
              ? `${resendText} (${formatTime(seconds)})`
              : resendCount >= maxResends
              ? TEXT.MAX_ATTEMPTS_REACHED
              : resendText
          }
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ResendOTPTimer;
