import {View, Text} from 'react-native';
import React, {FC} from 'react';
import {AppHeader, AppLabel, AppView} from '@global-components';
import {useText} from '@localization';
import {FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import styles from './styles';
import {useAppSelector} from '@redux/reduxHook';
import {formatMemberSince} from '@utils';

const Membership: FC = () => {
  const Profile = useAppSelector(state => state.app?.userInfo);
  const {TEXT} = useText();
  return (
    <AppView customViewStyle={{gap: SPACING.custom(28)}}>
      <AppHeader title={TEXT.MEMBERSHIP_STATUS} />
      <View style={styles.container}>
        <View style={styles.topLine} />
        <View style={styles.innerContainer}>
          <AppLabel
            text={formatMemberSince(Profile?.date_joined || '', 'short')}
            fontFamily={FONT_FAMILY.Semibold}
          />
          {/* <AppLabel
            text={TEXT.LEVEL_LABEL}
            fontFamily={FONT_FAMILY.Regular}
            fontSize={FONT_VARIENTS.p}
          /> */}
        </View>
      </View>
    </AppView>
  );
};

export default Membership;
