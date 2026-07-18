import {View, Text, TouchableOpacity} from 'react-native';
import React, {FC, memo, useCallback} from 'react';
import styles from './styles';
import {ICON_SELECTION} from '@assets/icons';
import {AppLabel} from '@global-components';
import {FONT_FAMILY} from '@theme';
import {TEXT} from '@constants';
import getLanguageIcon from './getLanguageIcon';
import {useAppDispatch} from '@redux/reduxHook';
import {setCurrentLanguage} from '@redux/app-slice';

const LanguageCard: FC<{language: Language; isSelected: boolean}> = ({
  language,
  isSelected,
}) => {
  const ICON = getLanguageIcon(language?.code);
  const dispatch = useAppDispatch();

  const handleLanguageChange = useCallback(() => {
    language?.code && dispatch(setCurrentLanguage(language.code));
  }, [language?.code]);

  return (
    <TouchableOpacity style={styles.container} onPress={handleLanguageChange}>
      <View style={styles.rowCenter}>
        <ICON />
        <AppLabel
          // text={TEXT.ENGLISH}
          text={language?.name}
          fontFamily={FONT_FAMILY.Medium}
          textStyle={styles.textStyle}
        />
      </View>
      {isSelected && <ICON_SELECTION />}
    </TouchableOpacity>
  );
};

export default memo(LanguageCard);
