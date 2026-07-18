import {View, TouchableOpacity, Alert} from 'react-native';
import React, {FC, useMemo, useState} from 'react';
import {
  AppButton,
  AppConfirmationModal,
  AppHeader,
  AppImage,
  AppLabel,
  AppTextInput,
  AppView,
} from '@global-components';
import {STORAGE} from '@constants';
import styles from './styles';
import {useFormik} from 'formik';
import {ProfileEditValues} from './types';
import {profileValidationSchema, setPrefsValue} from '@utils';
import {ICON_CAMERA, ICON_CONFIRM, ICON_EMAIL, ICON_NAME} from '@assets/icons';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '@redux/reduxHook';
import {COLORS} from '@theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {pickImageFromCamera, pickImageFromGallery} from '../../../services';
import {
  useDeleteProfileMutation,
  useUpdateProfileMutation,
} from '@redux/auth-api-slice';
import Toast from 'react-native-toast-message';
import {goBack} from '@navigation-utils';
import {setIsLogin} from '@redux/app-slice';
import {useText} from '@localization';

const ProfileEdit: FC = () => {
  const dispatch = useAppDispatch();
  const Profile = useAppSelector(state => state?.app?.userInfo);
  const [image, setImage] = useState<string>(Profile?.image || '');
  const [triggerUpdateProfile, {isLoading}] = useUpdateProfileMutation();
  const [triggerDeleteProfile, {isLoading: deleteLoading}] =
    useDeleteProfileMutation();
  const {TEXT} = useText();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const handlePress = async (mode: string) => {
    if (mode === 'camera') {
      const image = await pickImageFromCamera();
      if (image?.errorMessage) {
        Alert.alert('Error', image?.errorMessage);
      } else if (image?.assets && image?.assets[0]?.uri) {
        setImage(image?.assets[0]?.uri);
      }
    } else {
      const image = await pickImageFromGallery();
      if (image?.errorMessage) {
        Alert.alert('Error', image?.errorMessage);
      } else if (image?.assets && image?.assets[0]?.uri) {
        setImage(image?.assets[0]?.uri);
      }
    }
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', formik.values?.userName);
      if (image !== Profile?.image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpg',
          name: 'profile.jpg',
        });
      }
      const response = await triggerUpdateProfile(formData).unwrap();
      if (response?.success) {
        Toast.show({
          text1: response?.message || 'Profile Updated successfully',
          type: 'success',
        });
        goBack();
      }
    } catch (error) {
      console.error('Profile Update error ', error);
    }
  };

  const deleteProfile = async () => {
    try {
      const response = await triggerDeleteProfile(null);
      if (response?.data?.success) {
        Toast.show({
          text1: response?.data?.message,
          type: 'success',
        });
        setIsDelete(false);
        setPrefsValue(STORAGE.TOKEN, '');
        setPrefsValue(STORAGE.USER_ID, '');
        dispatch(setIsLogin(false));
      }
    } catch (error) {
      console.error('Delete Profile Error ', error);
    }
  };

  const formik = useFormik<ProfileEditValues>({
    initialValues: {
      emailAddress: Profile?.email || '',
      userName: Profile?.name || '',
    },
    validationSchema: profileValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: updateProfile,
  });

  const isButtonDisabled = useMemo(() => {
    return (
      formik.values?.userName === Profile?.name &&
      formik.values?.userName !== '' &&
      formik.values?.emailAddress !== '' &&
      formik.values?.emailAddress === Profile?.email &&
      image == Profile?.image
    );
  }, [
    formik.values.userName,
    formik.values.emailAddress,
    Profile?.name,
    Profile?.email,
    image,
    Profile?.image,
  ]);

  return (
    <AppView>
      <AppHeader title={TEXT.EDIT_PROFILE} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        keyboardDismissMode="interactive"
        bounces={false}
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputsContainer}>
          <View style={styles.imageContainer}>
            <AppImage uri={image} imageContainerStyle={styles.imageStyle} />
            <TouchableOpacity
              style={styles.cameraContainer}
              onPress={() => {
                Alert.alert(TEXT.PICK_IMAGE_TITLE, TEXT.PICK_IMAGE_MESSAGE, [
                  {text: TEXT.CANCEL, style: 'cancel'},
                  {text: TEXT.CAMERA, onPress: () => handlePress('camera')},
                  {text: TEXT.GALLERY, onPress: () => handlePress('gallery')},
                ]);
              }}>
              <ICON_CAMERA />
            </TouchableOpacity>
          </View>
          <Animated.View layout={LinearTransition.springify().damping(14)}>
            <AppTextInput
              placeholder={TEXT.ENTER_YOUR_NAME}
              leftIcon={<ICON_NAME />}
              input={formik.values.userName}
              setInput={formik.handleChange('userName')}
              isError={formik?.errors?.userName}
            />

            <AppTextInput
              placeholder={TEXT.ENTER_YOUR_EMAIL}
              leftIcon={<ICON_EMAIL />}
              input={formik.values.emailAddress}
              setInput={formik.handleChange('emailAddress')}
              isError={formik?.errors?.emailAddress}
              editable={false}
              inputContainer={styles.disbaledTextInputStyle}
              inputStyle={{color: COLORS.DISABLED_TEXT_COLOR}}
            />
          </Animated.View>
          <AppButton
            text={TEXT.UPDATE_PROFILE}
            onHandlePress={formik.handleSubmit}
            disabled={isButtonDisabled}
            customStyle={{opacity: isButtonDisabled ? 0.7 : 1}}
            isLoading={isLoading}
          />
        </View>
        <AppLabel
          text={TEXT.DELETE_ACCOUNT}
          textStyle={styles.deleteAccountText}
          onPress={() => setIsDelete(true)}
        />
      </KeyboardAwareScrollView>

      <AppConfirmationModal
        visible={isDelete}
        actionPerformed={TEXT.DELETE_ACCOUNT_TITLE}
        confirmationText={TEXT.DELETE_ACCOUNT_CONFIRMATION}
        icon={<ICON_CONFIRM />}
        isIcon={true}
        isCloseIcon={true}
        rightButton={true}
        rightButtonLoading={deleteLoading}
        rightButtonText={TEXT.DELETE_ACCOUNT}
        onPressLeftButton={() => setIsDelete(false)}
        onPressRightButton={deleteProfile}
        onClose={() => setIsDelete(false)}
      />
    </AppView>
  );
};

export default ProfileEdit;
