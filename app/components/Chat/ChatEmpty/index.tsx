import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {FC, useMemo} from 'react';
import {AppLabel, AppView, ChatHeader} from '@components';
import {IMAGE_LOGO} from '@assets/icons';
import styles from './styles';
import {FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {useAppSelector} from '@redux/reduxHook';
import {PROMPTS} from './prompts';
import {PromptType, TOPICS} from './topics';
import {useText} from '@localization';

const Chat: FC<{
  onPromptPress: (prompt: PromptType) => void;
  showPrompts?: boolean;
  isAgent?: boolean;
}> = ({onPromptPress, showPrompts = true, isAgent = false}) => {
  const Profile = useAppSelector(state => state?.app?.userInfo);
  const {TEXT} = useText();
  const CurrentLanguage = useAppSelector(state => state?.app?.currentLanguage);

  const DATA = useMemo(() => {
    return isAgent ? TOPICS() : PROMPTS();
  }, [isAgent, CurrentLanguage]);

  return (
    <View>
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
        {isAgent ? (
          <AppLabel
            text={TEXT.AGENTS_DISCOVER}
            fontSize={FONT_VARIENTS.h4}
            fontFamily={FONT_FAMILY.Medium}
            textAlign="center"
          />
        ) : (
          <>
            <AppLabel
              text={`${TEXT.HELLO} ${Profile?.name}`}
              textAlign="center"
            />
            <AppLabel text={TEXT.HOW_CAN_I_ASSIST} textAlign="center" />
          </>
        )}
      </View>

      {showPrompts && (
        <View style={styles.promptContainer}>
          <AppLabel
            text={isAgent ? TEXT.SELECT_A_TOPIC : TEXT.PROMPT_SUGGESTIONS}
            fontFamily={FONT_FAMILY.Semibold}
            fontSize={FONT_VARIENTS.h4}
          />

          <View style={{gap: SPACING.s}}>
            {DATA?.map((prompt, index) => (
              <TouchableOpacity
                onPress={() => onPromptPress(prompt)}
                style={styles.promptTextContainer}
                key={index.toString()}>
                <AppLabel
                  text={prompt.title}
                  fontSize={FONT_VARIENTS.custom(14)}
                  textAlign="center"
                />
                {!!prompt.subtitle && (
                  <AppLabel
                    text={prompt.subtitle}
                    fontSize={FONT_VARIENTS.custom(12)}
                    textAlign="center"
                    textStyle={{opacity: 0.7}}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default Chat;
