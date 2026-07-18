import {View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppViewProps} from './types';

const AppView: FC<AppViewProps> = ({
  children,
  customViewStyle,
  testID = 'app-view',
  onStartShouldSetResponder,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      onStartShouldSetResponder={onStartShouldSetResponder}
      testID={testID}
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
        customViewStyle,
      ]}>
      {/* <View style={{paddingTop: insets.top || StatusBar.currentHeight}}> */}
      {children}
      {/* </View> */}
    </View>
  );
};

export default AppView;
