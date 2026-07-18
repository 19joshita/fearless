import {View, Text, ScrollView, ViewStyle} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppScrollViewProps} from './types';

const AppScrollView: FC<AppScrollViewProps> = ({
  children,
  customStyle,
  contentContainerStyle,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      testID="app-scroll-view"
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
        customStyle,
      ]}
      contentContainerStyle={[
        styles.contentContainerStyle,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
};

export default AppScrollView;
