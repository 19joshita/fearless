import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import {MergedStackParamsList} from './types';

export const navigationRef =
  createNavigationContainerRef<MergedStackParamsList>();

export async function navigate(routeName: string, params?: object) {
  // ✅ FIX: Add 'await' here!
  await navigationRef?.isReady(); 
  
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
  } else {
    // ✅ FIX: Add a fallback just in case it's still not ready
    console.log('Navigation not ready, waiting 500ms...');
    setTimeout(async () => {
      await navigationRef?.isReady();
      if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.navigate(routeName, params));
      }
    }, 500);
  }
}

export async function replace(routeName: string, params?: object) {
  await navigationRef?.isReady(); // ✅ Add await here too
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  }
}

export async function resetAndNavigate(routeName: string, params?: object) {
  await navigationRef?.isReady(); // ✅ Add await here too
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: routeName}],
      }),
    );
  }
}

export async function goBack() {
  await navigationRef?.isReady(); // ✅ Add await here too
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
  }
}

export function canGoBack() {
  if (navigationRef?.isReady()) {
    return navigationRef?.canGoBack();
  }
  return false;
}