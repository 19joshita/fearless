import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useCallback} from 'react';
import {AppHeader, AppLabel, AppView} from '@global-components';
import {useText} from '@localization';
import {
  FONT_FAMILY,
  FONT_VARIENTS,
  screenHeight,
  SPACING,
  COLORS,
} from '@theme';
import {useAppSelector} from '@redux/reduxHook';
import {LanguageCard} from '@components';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {useGetLanguagesQuery} from '@redux/auth-api-slice';

const LanguageSheet = () => {
  const {TEXT} = useText();
  const {languages, currentLanguage} = useAppSelector(state => state?.app);

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

  const {refetch: refetchLanguages, isFetching} = useGetLanguagesQuery(null);

  const ListEmptyComponent = useCallback(() => {
    if (isFetching) {
      return (
        <View
          style={{
            justifyContent: 'center',
            height: screenHeight * 0.2,
            alignItems: 'center',
          }}>
          <ActivityIndicator size="small" color={COLORS.SECONDARY_COLOR} />
        </View>
      );
    }

    return (
      <View
        style={{
          justifyContent: 'center',
          height: screenHeight * 0.2,
          alignItems: 'center',
        }}>
        <AppLabel
          text={TEXT.NO_LANGUAGES_FOUND}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
          textAlign="center"
        />
        <TouchableOpacity
          onPress={() => {
            refetchLanguages();
          }}
          style={{marginTop: SPACING.s, alignSelf: 'center'}}>
          <AppLabel
            text={TEXT.RETRY_LOAD_LANGUAGES}
            fontSize={FONT_VARIENTS.custom(12)}
            fontFamily={FONT_FAMILY.Medium}
            color={COLORS.SECONDARY_COLOR}
            textAlign="center"
          />
        </TouchableOpacity>
      </View>
    );
  }, [refetchLanguages, isFetching]);

  return (
    <AppView
      customViewStyle={{
        paddingTop: SPACING.l,
        // flex: 1,
        // flexGrow: 1,
        height: screenHeight,
      }}>
      <Animated.View
        layout={LinearTransition.springify().damping(14)}
        style={{gap: SPACING.s}}>
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
        {languages && languages.length > 0 ? (
          languages.map(lang => (
            <LanguageCard
              key={lang?.uuid}
              isSelected={lang?.code === currentLanguage}
              language={lang}
            />
          ))
        ) : (
          <ListEmptyComponent />
        )}
      </Animated.View>
    </AppView>
  );
};

export default LanguageSheet;
