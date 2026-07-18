import {View, Text, Linking} from 'react-native';
import React, {FC} from 'react';
import {AppHeader, AppLabel, AppView} from '@global-components';
import {useText} from '@localization';
import {FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {Link} from '@react-navigation/native';

const Information: FC = () => {
  const {TEXT} = useText();
  const openLink = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open URL: ", url);
    }
  };
  const UrlText = ({url}: {url: string}) => (
    <Text
      style={{color: 'blue', textDecorationLine: 'underline'}}
      onPress={() => openLink(url)}>
      {url}
    </Text>
  );
  return (
    <AppView>
      <AppHeader title={TEXT.INFORMATION} />
      <AppLabel
        text={TEXT.ABOUT_THIS_APP}
        fontSize={FONT_VARIENTS.h4}
        fontFamily={FONT_FAMILY.Semibold}
      />

      <AppLabel
        text={`${TEXT.OWNER}:`}
        fontSize={FONT_VARIENTS.h5}
        fontFamily={FONT_FAMILY.Medium}
        textStyle={{paddingTop: SPACING.custom(6)}}
      />

      <View style={{gap: SPACING.s, paddingTop: SPACING.s}}>
        <AppLabel
          text={`masterminds.cc`}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
        />
        <AppLabel
          text={`Lohmühlweg 1`}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
        />
        <AppLabel
          text={`65187 Wiesbaden`}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
        />
        <AppLabel
          text={`Germany`}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
        />
        <AppLabel
          text={`www.masterminds.cc`}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
          onPress={() => openLink('https://www.masterminds.cc')}
          textStyle={{color: 'blue', textDecorationLine: 'underline'}}
        />
        <AppLabel
          text={`hello@masterminds.cc`}
          fontSize={FONT_VARIENTS.h6}
          fontFamily={FONT_FAMILY.Regular}
          onPress={() => openLink('mailto:hello@masterminds.cc')}
          textStyle={{color: 'blue', textDecorationLine: 'underline'}}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <AppLabel
            text={`${TEXT.IMPRINT} `}
            fontSize={FONT_VARIENTS.h6}
            fontFamily={FONT_FAMILY.Regular}
          />
          <AppLabel
            text={TEXT.IMPRINT_URL}
            fontSize={FONT_VARIENTS.h6}
            fontFamily={FONT_FAMILY.Regular}
            onPress={() => openLink(TEXT.IMPRINT_URL)}
            textStyle={{color: 'blue', textDecorationLine: 'underline'}}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <AppLabel
            text={`${TEXT.PRIVACY_POLICY} `}
            fontSize={FONT_VARIENTS.h6}
            fontFamily={FONT_FAMILY.Regular}
          />
          <AppLabel
            text={TEXT.PRIVACY_POLICY_URL}
            fontSize={FONT_VARIENTS.h6}
            fontFamily={FONT_FAMILY.Regular}
            onPress={() => openLink(TEXT.PRIVACY_POLICY_URL)}
            textStyle={{color: 'blue', textDecorationLine: 'underline'}}
          />
        </View>
      </View>
    </AppView>
  );
};

export default Information;
