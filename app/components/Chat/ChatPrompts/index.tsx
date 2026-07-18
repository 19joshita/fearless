import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {AppLabel} from '@global-components';
import {FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import styles from './styles';
import {useText} from '@localization';
import {PromptType} from '../ChatEmpty/assitants';

const ChatPrompts: FC<{
  DATA: PromptType[];
  onPromptPress: (prompt: PromptType) => void;
  headingTitle?: string;
}> = ({DATA, onPromptPress, headingTitle}) => {
  const {TEXT} = useText();
  return (
    <View style={styles.promptContainer}>
      <AppLabel
        text={headingTitle || ''}
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
  );
};

export default ChatPrompts;
