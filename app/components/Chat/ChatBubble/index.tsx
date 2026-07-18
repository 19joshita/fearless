import {View, Text, Easing} from 'react-native';
import React from 'react';
import {useAppSelector} from '@redux/reduxHook';
import {COLORS, FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import {AppImage, AppLabel} from '@global-components';
import {
  ICON_RECIEVER_RADIUS,
  ICON_SEND_RADIUS,
  IMAGE_LOGO,
} from '@assets/icons';
import ChatAnimatingText from '../ChatAnimatingText';
import Animated, {LinearTransition} from 'react-native-reanimated';

const ChatBubble = ({
  text,
  isReciever,
  isTyping,
  onTypingComplete,
}: {
  text: string;
  isReciever: boolean;
  isTyping?: boolean;
  onTypingComplete?: () => void;
}) => {
  const Profile = useAppSelector(state => state.app?.userInfo);
  return (
    <View
      style={{
        marginVertical: scaleSize(12),
        flexDirection: isReciever ? 'row-reverse' : 'row',
        gap: SPACING.custom(12),
        // flexGrow: 1,
        // flexShrink: 1,
        alignSelf: isReciever ? 'flex-start' : 'flex-end',
        // width: 50,
        // alignItems: 'center',
      }}>
      <Animated.View
        style={{
          borderRadius: SPACING.custom(12),
          backgroundColor: isReciever ? COLORS.WHITE_COLOR : '#E7E6DC',
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.m,
          //   flexDirection: 'row',
          //   alignItems: 'center',
          justifyContent: 'center',
          minHeight: scaleSize(52),
          //   flexGrow: 1,
          flexShrink: 1,
        }}>
        {/* <AppLabel text={text} /> */}
        {isTyping && isReciever ? (
          <ChatAnimatingText
            text={text}
            textStyle={{
              fontSize: FONT_VARIENTS.custom(14),
              color: COLORS.TEXT_COLOR,
              fontFamily: FONT_FAMILY.Regular,
            }}
            onTypingComplete={onTypingComplete}
          />
        ) : (
          <AppLabel
            text={text}
            fontSize={FONT_VARIENTS.custom(14)}
            fontFamily={FONT_FAMILY.Regular}
            color={COLORS.TEXT_COLOR}
          />
        )}

        {!isReciever && (
          <View style={{position: 'absolute', right: -6, bottom: 0}}>
            <ICON_SEND_RADIUS />
          </View>
        )}

        {isReciever && (
          <View style={{position: 'absolute', left: -6, bottom: 0}}>
            <ICON_RECIEVER_RADIUS />
          </View>
        )}
      </Animated.View>

      <AppImage
        imageContainerStyle={{
          height: scaleSize(52),
          aspectRatio: 1,
          borderRadius: scaleSize(52) / 2,
          backgroundColor: isReciever ? COLORS.WHITE_COLOR : undefined,
        }}
        path={isReciever ? IMAGE_LOGO : undefined}
        uri={isReciever ? undefined : Profile?.image}
      />
    </View>
  );
};

export default ChatBubble;
