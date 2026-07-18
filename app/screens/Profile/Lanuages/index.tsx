import {View, FlatList} from 'react-native';
import React, {FC, useCallback} from 'react';
import {AppHeader, AppLabel, AppView} from '@global-components';
import {useText} from '@localization';
import {FONT_FAMILY, FONT_VARIENTS, screenHeight, SPACING} from '@theme';
import {LanguageCard} from '@components';
import {useAppSelector} from '@redux/reduxHook';
import Animated, {LinearTransition} from 'react-native-reanimated';

const Languages: FC = () => {
  const {languages, currentLanguage} = useAppSelector(state => state?.app);
  const {TEXT} = useText();

  const renderItem = useCallback(
    ({item}: {item: Language}) => {
      return (
        <LanguageCard
          language={item}
          isSelected={item?.code === currentLanguage}
        />
      );
    },
    [currentLanguage],
  );

  const keyExtracter = useCallback((item: Language, index: number) => {
    return item?.uuid || index?.toString();
  }, []);

  const ListEmptyComponent = useCallback(() => {
    return (
      <View
        style={{
          justifyContent: 'center',
          height: screenHeight * 0.2,
        }}>
        <AppLabel
          text={TEXT.NO_LANGUAGES_FOUND}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
          textAlign="center"
        />
      </View>
    );
  }, []);

  return (
    <AppView customViewStyle={{gap: SPACING.custom(28)}}>
      <AppHeader title={TEXT.LANGUAGE} />
      <View style={{gap: SPACING.custom(12)}}>
        <AppLabel
          text={TEXT.LANGUAGE}
          fontSize={FONT_VARIENTS.h3}
          fontFamily={FONT_FAMILY.Semibold}
        />
        <AppLabel
          text={TEXT.SELECT_PREFERED_LANGUAGE}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
        />
      </View>
      <Animated.FlatList
        data={languages || []}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtracter}
        contentContainerStyle={{gap: SPACING.s}}
        ListEmptyComponent={ListEmptyComponent}
        layout={LinearTransition.springify().damping(12)}
      />
    </AppView>
  );
};

export default Languages;
