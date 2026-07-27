import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {FC, useMemo, useState} from 'react';
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
import {setIsLogin} from '@redux/app-slice';
import {useText} from '@localization';
import useProfileMenuData from './profileMenuData';

const ProfileView: FC = () => {
  const Profile = useAppSelector(state => state.app.userInfo);
  const currentLanguage = useAppSelector(state => state.app.currentLanguage);
  const [isLogout, setIsLogout] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {TEXT} = useText();
  const {profileMenu} = useProfileMenuData();
  const logout = () => {
    dispatch(setIsLogin(false));
    setPrefsValue(STORAGE.TOKEN, '');
    setPrefsValue(STORAGE.USER_ID, '');
    setPrefsValue(STORAGE.FCM_TOKEN, '');
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
        contentContainerStyle={{
          gap: SPACING.m,
          paddingBottom: SPACING.s,
        }}
        ListFooterComponent={
          <AppButton
            text={TEXT.LOG_OUT}
            onHandlePress={() => setIsLogout(true)}
          />
        }
      />
      {/* <AppButton
        text={TEXT.LOG_OUT}
        customStyle={{marginVertical: SPACING.m}}
      /> */}
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
