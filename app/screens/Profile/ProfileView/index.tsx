import {View, FlatList, TouchableOpacity} from 'react-native';
import React, {FC, useState} from 'react';
import {
  AppButton,
  AppConfirmationModal,
  AppHeader,
  AppImage,
  AppLabel,
  AppView,
} from '@global-components';
import {STORAGE} from '@constants';
import styles from './styles';
import {ICON_EDIT} from '@assets/icons';
import {ProfileMenu} from '@components';
import {SPACING} from '@theme';
import {navigate} from '@navigation-utils';
import {formatMemberSince, RouteNames, setPrefsValue} from '@utils';
import {useAppDispatch, useAppSelector} from '@redux/reduxHook';
import {setIsLogin, setUserInfo} from '@redux/app-slice';
import {useText} from '@localization';
import useProfileMenuData from './profileMenuData';
import {useLazyLogoutQuery} from '@redux/auth-api-slice';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const ProfileView: FC = () => {
  const Profile = useAppSelector(state => state.app.userInfo);
  const [isLogout, setIsLogout] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {TEXT} = useText();
  const {profileMenu} = useProfileMenuData();
  const [triggerLogout] = useLazyLogoutQuery();

  const logout = async () => {
    try {
      // ==========================================
      // 1. EXPIRE/DELETE FCM TOKEN IMMEDIATELY
      // This makes the old token physically useless. 
      // Android can no longer show background notifications for User A.
      // ==========================================
      try {
        await messaging().deleteToken();
        console.log('✅ FCM Token Destroyed');
      } catch (e) {
        console.error('Failed to delete token', e);
      }

      // Clear local storage tracking variables
      setPrefsValue(STORAGE.FCM_TOKEN, '');
      setPrefsValue(STORAGE.REGISTERED_FCM_TOKEN, '');
      setPrefsValue(STORAGE.REGISTERED_USER_ID, '');
      
      // Clear any visible notifications from the tray instantly
      await notifee.cancelAllNotifications();

      // ==========================================
      // 2. NORMAL LOGOUT STUFF
      // ==========================================
      triggerLogout(null).unwrap().catch(console.error);
      
      dispatch(setIsLogin(false));
      dispatch(setUserInfo(undefined)); // Use undefined based on your slice
      
      setPrefsValue(STORAGE.TOKEN, '');
      setPrefsValue(STORAGE.USER_ID, '');
      setPrefsValue(STORAGE.ISLOGGED, '');
      setPrefsValue(STORAGE.USER_DATA, '');

    } catch (e) {
      console.log('Logout error', e);
    }
  };

  return (
    <AppView customViewStyle={{paddingBottom: 0}}>
      <AppHeader title={TEXT.PROFILE} isLeftIcon={false} />
      <View style={styles.profileContainer}>
        <AppImage uri={Profile?.image} />
        <View style={styles.textContainer}>
          <AppLabel textStyle={styles.titleStyle} text={Profile?.name} />
          <AppLabel
            textStyle={styles.descriptionStyle}
            text={formatMemberSince(Profile?.date_joined || '', 'long')}
          />
        </View>
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={() => navigate(RouteNames.PROFILE_EDIT)}>
          <ICON_EDIT />
        </TouchableOpacity>
      </View>

      <FlatList
        style={{marginTop: SPACING.m}}
        data={profileMenu}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <ProfileMenu title={item.title} icon={item.icon} onPress={item.onPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: SPACING.m, paddingBottom: SPACING.s}}
        ListFooterComponent={
          <AppButton text={TEXT.LOG_OUT} onHandlePress={() => setIsLogout(true)} />
        }
      />
      <AppConfirmationModal
        visible={isLogout}
        actionPerformed={TEXT.LOG_OUT}
        confirmationText={TEXT.CONFIRM_LOGOUT}
        leftButton={true}
        leftButtonText={TEXT.CANCEL}
        rightButton={true}
        rightButtonText={TEXT.LOG_OUT}
        onPressLeftButton={() => setIsLogout(false)}
        onPressRightButton={logout}
        onClose={() => setIsLogout(false)}
      />
    </AppView>
  );
};

export default ProfileView;