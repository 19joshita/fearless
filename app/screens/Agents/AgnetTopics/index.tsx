import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {AppLabel, AppView, ChatHeader} from '@components';
import {TEXT} from '@constants';
import {IMAGE_LOGO} from '@assets/icons';
import styles from './styles';
import {FONT_FAMILY, FONT_VARIENTS, SPACING} from '@theme';
import {useAppSelector} from '@redux/reduxHook';
import {TOPICS} from './topics';
import {canGoBack, navigate} from '@navigation-utils';
import {RouteNames} from '@utils';

const AgentTopics: FC = ({}) => {
  const Profile = useAppSelector(state => state?.app?.userInfo);
  return (
    <AppView>
      <ChatHeader
        title={TEXT.AGENTS}
        isLeftIcon={false}
        isDisabled={false}
        onlayout={() => {}}
      />
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
          text={TEXT.AGENTS_DISCOVER}
          fontSize={FONT_VARIENTS.h4}
          fontFamily={FONT_FAMILY.Medium}
          textAlign="center"
        />
      </View>

      <View style={styles.promptContainer}>
        <AppLabel
          text={TEXT.SELECT_A_TOPIC}
          fontFamily={FONT_FAMILY.Semibold}
          fontSize={FONT_VARIENTS.h4}
        />
        <View style={{gap: SPACING.s}}>
          {TOPICS.map((topic, index) => (
            <TouchableOpacity
              onPress={() =>
                navigate(RouteNames.AGENT_CHAT, {selectedTopic: topic})
              }
              style={styles.promptTextContainer}
              key={index.toString()}>
              <AppLabel
                text={topic}
                textAlign="center"
                fontSize={FONT_VARIENTS.custom(14)}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </AppView>
  );
};

export default AgentTopics;
