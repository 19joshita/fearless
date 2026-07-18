import React, {useEffect} from 'react';
import RootNavigation from './app/navigation/RootNavigation';
import {Provider} from 'react-redux';
import {persistor, store} from './app/redux/store';
import {View} from 'react-native';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PersistGate} from 'redux-persist/integration/react';
import {useGetLanguagesQuery} from '@redux/auth-api-slice';
import {addEventListener} from '@react-native-community/netinfo';
import {setIsInternetConnected} from '@redux/app-slice';
import {useAppDispatch} from '@redux/reduxHook';
import {ReducedMotionConfig, ReduceMotion} from 'react-native-reanimated';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ReducedMotionConfig mode={ReduceMotion.Never} />
          <GestureHandlerRootView>
            <KeyboardProvider>
              <RootNavigation />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </View>
  );
};

export default App;
