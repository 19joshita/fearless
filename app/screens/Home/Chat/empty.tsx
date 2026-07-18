import {View, Text, Image} from 'react-native';
import React, {FC} from 'react';
import {AppLabel, AppView, ChatHeader} from '@components';
import {TEXT} from '@constants';
import {IMAGE_LOGO} from '@assets/icons';
import styles from './styles';
import {FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {useAppSelector} from '@redux/reduxHook';
import {PROMTS} from './prompts';

const Chat: FC = () => {
  const Profile = useAppSelector(state => state?.app?.userInfo);
  return (
    <AppView>
      <ChatHeader title={TEXT.CHAT} isLeftIcon={false} />

      <Image source={IMAGE_LOGO} style={styles.imageStyle} />
      <AppLabel
        text={TEXT.FEARLESS_CODE_ADVISER}
        textStyle={{
          textTransform: 'uppercase',
          textAlign: 'center',
          paddingVertical: SPACING.m,
        }}
        fontFamily={FONT_FAMILY.Medium}
      />

      <View style={{gap: SPACING.s, paddingVertical: SPACING.m}}>
        <AppLabel text={`Hello ${Profile?.name}`} textAlign="center" />
        <AppLabel text={TEXT.HOW_CAN_I_ASSIST} textAlign="center" />
      </View>

      <View style={styles.promptContainer}>
        <AppLabel
          text={TEXT.PROMPT_SUGGESTIONS}
          fontFamily={FONT_FAMILY.Semibold}
          fontSize={FONT_VARIENTS.h4}
        />
        <View style={{gap: SPACING.s}}>
          {PROMTS.map((prompt, index) => (
            <View style={styles.promptTextContainer}>
              <AppLabel text={prompt} fontSize={FONT_VARIENTS.custom(14)} />
            </View>
          ))}
        </View>
      </View>
    </AppView>
  );
};

export default Chat;
