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
      // 1. HIT BACKEND LOGOUT FIRST!!!
      // ==========================================
      // At this exact moment, STORAGE.FCM_TOKEN still has the token.
      // auth-api-slice.ts reads it and attaches it to the X-Device-Token header.
      // The backend middleware intercepts this and deletes it from the database.
      await triggerLogout(null).unwrap().catch(console.error);
      // ==========================================
      // 2. LOCAL DEVICE CLEANUP (After backend is done)
      // ==========================================
      try {
        await messaging().deleteToken();
        console.log('✅ FCM Token Destroyed from device');
      } catch (e) {
        console.error('Failed to delete token', e);
      }
      // Clear FCM token from local MMKV storage
      setPrefsValue(STORAGE.FCM_TOKEN, '');
      // ✅ REMOVED: REGISTERED_FCM_TOKEN & REGISTERED_USER_ID (No longer needed in new flow)

      // Clear any visible notifications from the tray instantly
      await notifee.cancelAllNotifications();

      // ==========================================
      // 3. NORMAL LOGOUT STUFF
      // ==========================================
      dispatch(setIsLogin(false));
      dispatch(setUserInfo(undefined));

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
          <ProfileMenu
            title={item.title}
            icon={item.icon}
            onPress={item.onPress}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: SPACING.m, paddingBottom: SPACING.s}}
        ListFooterComponent={
          <AppButton
            text={TEXT.LOG_OUT}
            onHandlePress={() => setIsLogout(true)}
          />
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
