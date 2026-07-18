import {View, Text, StatusBar, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IMAGE_SPLASH} from '@assets/icons';

const Splash = () => {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setHidden(true);
  }, []);
  return (
    <View style={{}}>
      <Image source={IMAGE_SPLASH} />
    </View>
  );
};

export default Splash;
