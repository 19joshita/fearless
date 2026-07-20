import React from 'react';
import RootNavigation from './app/navigation/RootNavigation';
import {Provider} from 'react-redux';
import {persistor, store} from './app/redux/store';
import {View} from 'react-native';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PersistGate} from 'redux-persist/integration/react';
import {ReducedMotionConfig, ReduceMotion} from 'react-native-reanimated';
import useNotifications from './app/hooks/useNotifications';

const App = () => {
  useNotifications();

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
