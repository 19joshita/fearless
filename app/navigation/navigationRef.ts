import { MergedStackParamsList } from '@navigation-utils';
import {
    createNavigationContainerRef,
    CommonActions,
    StackActions,
} from '@react-navigation/native';


// ==========================================
// YOUR EXISTING CODE
// ==========================================
export const navigationRef =
    createNavigationContainerRef<MergedStackParamsList>();

export async function navigate(routeName: string, params?: object) {
    navigationRef?.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.navigate(routeName, params));
    }
}

export async function replace(routeName: string, params?: object) {
    navigationRef?.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(routeName, params));
    }
}

export async function resetAndNavigate(routeName: string, params?: object) {
    navigationRef?.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: routeName }],
            }),
        );
    }
}

export async function goBack() {
    navigationRef?.isReady();
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

// ==========================================
// NEW: NOTIFICATION REDIRECT LOGIC
// ==========================================

export type NotificationRedirect = {
    screen: string;
    params?: Record<string, unknown>;
};

/** Navigate based on notification redirect data */
export function navigateFromNotificationRedirect(
    redirect: NotificationRedirect | null,
): void {
    if (!redirect) {
        console.warn('Cannot navigate — redirect is null');
        return;
    }

    const { screen, params } = redirect;
    // Use your existing global navigate function
    void navigate(screen, params);
}