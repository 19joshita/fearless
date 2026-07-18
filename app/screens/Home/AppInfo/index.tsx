import {ActivityIndicator, View} from 'react-native';
import React, {FC} from 'react';
import {AppHeader, AppLabel, AppScrollView, AppView} from '@global-components';
import {FONT_FAMILY, FONT_VARIENTS} from '@theme';
import {useText} from '@localization';
import useGetUserManual from './useGetUserManual';
import styles from './styles';

const AppInfo: FC = () => {
  const {TEXT} = useText();
  const {content, loading} = useGetUserManual();

  return (
    <AppView customViewStyle={styles.container}>
      <AppHeader title={TEXT.INFO} />
      <AppScrollView
        customStyle={styles.scrollViewContainer}
        contentContainerStyle={styles.contentContainerStyle}>
        <AppLabel
          text={TEXT.USE_THIS_APP}
          fontSize={FONT_VARIENTS.h3}
          fontFamily={FONT_FAMILY.Semibold}
        />
        {loading ? (
          <View style={styles.lodingIndicatorContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <AppLabel
            text={content}
            fontSize={FONT_VARIENTS.h6}
            fontFamily={FONT_FAMILY.Regular}
          />
        )}
      </AppScrollView>
    </AppView>
  );
};

export default AppInfo;
