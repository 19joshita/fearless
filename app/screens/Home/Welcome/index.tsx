import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {AppLabel, AppScrollView, AppView} from '@global-components';
import {
  ICON_AGENTS_WHITE,
  ICON_CHAT_WHITE,
  ICON_PROFILE_WHITE,
  ICON_RESOURCES_WHITE,
  IMAGE_LOGO,
} from '@assets/icons';
import {STORAGE} from '@constants';
import {FONT_FAMILY, FONT_VARIENTS, scaleSize, SPACING} from '@theme';
import styles from './styles';
import {RouteNames, setPrefsValue} from '@utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useText} from '@localization';

const Welcome: FC = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const navigateToTab = (tabName: string) => {
    navigation.replace(RouteNames.BOTTOM_TABS, {
      screen: tabName,
    });

    setPrefsValue(STORAGE.ISONBOARDING, 'true');
  };
  const {TEXT} = useText();
  return (
    <AppScrollView
      customStyle={{marginTop: insets.top}}
      contentContainerStyle={{paddingBottom: insets.bottom + scaleSize(20)}}>
      <Image source={IMAGE_LOGO} style={styles.imageStyle} />
      <AppLabel
        text={TEXT.FEARLESS_CODE_ADVISER}
        textStyle={{
          textTransform: 'uppercase',
          textAlign: 'center',
          paddingVertical: SPACING.m,
        }}
        fontFamily={FONT_FAMILY.Medium}
      />

      <View style={{gap: SPACING.s, paddingVertical: SPACING.m}}>
        <AppLabel
          text={TEXT.WELCOME_TO_FEARLESS_CODE}
          fontFamily={FONT_FAMILY.Medium}
          fontSize={FONT_VARIENTS.custom(22)}
          textAlign="center"
        />
        <AppLabel
          text={TEXT.HOW_CAN_I_ASSIST}
          fontFamily={FONT_FAMILY.Regular}
          fontSize={FONT_VARIENTS.custom(18)}
          textAlign="center"
        />
      </View>

      <View style={styles.promptContainer}>
        <View style={styles.iconsRow}>
          <View style={{gap: SPACING.xs}}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigateToTab(RouteNames.CHAT)}>
              <ICON_CHAT_WHITE />
            </TouchableOpacity>
            <AppLabel
              fontFamily={FONT_FAMILY.Semibold}
              text={TEXT.CHAT}
              textAlign="center"
            />
          </View>

          <View style={{gap: SPACING.xs}}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigateToTab(RouteNames.AGENTS)}>
              <ICON_AGENTS_WHITE />
            </TouchableOpacity>
            <AppLabel
              fontFamily={FONT_FAMILY.Semibold}
              text={TEXT.AGENTS}
              textAlign="center"
            />
          </View>
        </View>

        <View style={styles.iconsRow}>
          <View style={{gap: SPACING.xs}}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigateToTab(RouteNames.RESOURCES)}>
              <ICON_RESOURCES_WHITE />
            </TouchableOpacity>
            <AppLabel
              fontFamily={FONT_FAMILY.Semibold}
              text={TEXT.RESOURCES}
              textAlign="center"
            />
          </View>

          <View style={{gap: SPACING.xs}}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => navigateToTab(RouteNames.PROFILE)}>
              <ICON_PROFILE_WHITE />
            </TouchableOpacity>
            <AppLabel
              fontFamily={FONT_FAMILY.Semibold}
              text={TEXT.PROFILE}
              textAlign="center"
            />
          </View>
        </View>
      </View>

      {/* <View
        style={[
          styles.promptContainer,
          {marginTop: SPACING.s, width: scaleSize(232), gap: SPACING.s},
        ]}>
        <AppLabel
          text={TEXT.NEW_ARTICLE}
          fontFamily={FONT_FAMILY.Bold}
          fontSize={FONT_VARIENTS.h4}
        />
        <AppLabel
          text={
            "Lorem Ipsum is simply dummy text of the print ing and type setting indu stry. Lorem Ips um has been the indu stry's stan dard dummy text ever since the 1500s, when an sent to you!"
          }
          fontFamily={FONT_FAMILY.Regular}
          fontSize={FONT_VARIENTS.custom(14)}
        />
      </View> */}
    </AppScrollView>
  );
};

export default Welcome;
