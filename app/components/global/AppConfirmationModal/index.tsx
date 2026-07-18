import React, {FC, ReactNode} from 'react';
import {View, Text, ViewStyle, TouchableOpacity} from 'react-native';
import style from './styles';
import AppLabel from '../AppLabel';
import AppButton from '../AppButton';
import {COLORS, scaleSize, screenWidth} from '@theme';
import AppModal from '../AppModal';
import {ICON_BACK, ICON_CLOSE} from '@assets/icons';
import Animated from 'react-native-reanimated';

interface IAppConfirmationModal {
  onClose?: any;
  visible?: boolean | any;
  actionPerformed?: string | any;
  confirmationText?: string | any;
  leftButton?: boolean;
  leftButtonText?: string | any;
  onPressLeftButton?: () => void;
  middleButton?: boolean;
  middleButtonText?: string | any;
  onPressMiddleButton?: () => void;
  rightButton?: boolean;
  rightButtonText?: string | any;
  onPressRightButton?: () => void;
  actionTextStyle?: any;
  confirmationTextStyle?: any;
  buttonGradientColors?: any;
  leftButtonGradientColors?: any;
  rightButtonGradientColors?: any;
  middleButtonGradientColors?: any;
  isIcon?: boolean;
  iconGradientColors?: any;
  icon?: any;
  leftButtonStyle?: any;
  rightButtonStyle?: any;
  leftTextColor?: any;
  rightTextColor?: any;
  customConainerStyle?: ViewStyle;
  buttonsContainerStyle?: ViewStyle;
  isCloseIcon?: boolean;
  rightButtonLoading?: boolean;
  customComponent?: ReactNode;
  customModalStyle?: ViewStyle;
}
const AppConfirmationModal: FC<IAppConfirmationModal> = ({
  onClose,
  visible,
  actionPerformed,
  confirmationText,
  leftButton,
  leftButtonText,
  onPressLeftButton,
  middleButton,
  middleButtonText,
  onPressMiddleButton,
  rightButton,
  rightButtonText,
  onPressRightButton,
  actionTextStyle,
  confirmationTextStyle,
  leftButtonGradientColors,
  rightButtonGradientColors,
  middleButtonGradientColors,
  isIcon = false,
  iconGradientColors,
  icon,
  leftButtonStyle,
  rightButtonStyle,
  leftTextColor,
  rightTextColor,
  customConainerStyle,
  buttonsContainerStyle,
  isCloseIcon = false,
  rightButtonLoading = false,
  customComponent,
  customModalStyle,
}) => {
  return (
    <AppModal
      customStyle={customModalStyle}
      onClose={onClose}
      visible={visible}
      animationType="fade">
      <Animated.View style={[style?.innerContainer, customConainerStyle]}>
        {isCloseIcon && (
          <TouchableOpacity
            onPress={onClose}
            hitSlop={20}
            style={{
              position: 'absolute',
              top: scaleSize(16),
              right: scaleSize(20),
              // justifyContent: 'flex-end',
            }}>
            <ICON_CLOSE />
          </TouchableOpacity>
        )}
        <View style={{gap: scaleSize(12)}}>
          {isIcon && (
            <View
              style={{
                alignSelf: 'center',
                // padding: size?.s16,
                borderRadius: scaleSize(28),
              }}>
              {icon}
            </View>
          )}

          <AppLabel
            text={actionPerformed}
            textStyle={{...style?.actionTextStyle, ...actionTextStyle}}
          />
        </View>
        {confirmationText && (
          <AppLabel
            text={confirmationText}
            textStyle={{
              ...style?.confirmationTextStyle,
              ...confirmationTextStyle,
            }}
          />
        )}
        {customComponent && customComponent}
        <View
          style={{
            flexDirection: 'row',
            // gap: size.s24,
            overflow: 'hidden',
            // justifyContent: 'space-between',
            gap: scaleSize(14),
            ...buttonsContainerStyle,
          }}>
          {leftButton && (
            <AppButton
              customStyle={{
                // marginHorizontal: scaleSize(18),
                marginVertical: scaleSize(10),
                flexGrow: 1,
                flexShrink: 1,
                // width: screenWidth * 0.35,
                borderWidth: 2,
                borderColor: COLORS.SECONDARY_COLOR,
                backgroundColor: 'transparent',
                // backgroundColor: leftTextColor,
                ...leftButtonStyle,
              }}
              text={leftButtonText}
              onHandlePress={onPressLeftButton}
            />
          )}
          {middleButton && (
            <AppButton
              customStyle={{
                // paddingHorizontal: scaleSize(18),
                marginVertical: scaleSize(10),
                // width: screenWidth * 0.4,
                backgroundColor: middleButtonGradientColors,
              }}
              text={middleButtonText}
              onHandlePress={onPressMiddleButton}
            />
          )}
          {rightButton && (
            <AppButton
              isLoading={rightButtonLoading}
              customStyle={{
                // marginHorizontal: scaleSize(18),
                marginVertical: scaleSize(10),
                flexGrow: 1,
                flexShrink: 1,
                // width: screenWidth * 0.35,
                // backgroundColor: rightTextColor,
                ...rightButtonStyle,
              }}
              text={rightButtonText}
              onHandlePress={onPressRightButton}
            />
          )}
        </View>
      </Animated.View>
    </AppModal>
  );
};
export default AppConfirmationModal;
