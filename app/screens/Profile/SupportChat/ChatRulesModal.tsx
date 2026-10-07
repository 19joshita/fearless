import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useText} from '@utils';
import {COLORS} from '@theme';

type SectionItem = {
  text?: string;
  heading?: string;
  bullets?: string[];
  style?: 'italic';
};

type ChatRulesModalProps = {
  visible: boolean;
  onClose: () => void;
  onStartChat?: () => void;
  readOnly?: boolean;
};

const ChatRulesModal: React.FC<ChatRulesModalProps> = ({
  visible,
  onClose,
  onStartChat,
  readOnly = false,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const {TEXT} = useText();

  const handleClose = () => {
    setIsChecked(false);
    onClose();
  };

  const sections: SectionItem[] = [
    {text: TEXT.FEARLESS_CHAT_INTRO},
    {
      heading: TEXT.FEARLESS_CHAT_BEFORE_START,
      bullets: [TEXT.FEARLESS_CHAT_Q1, TEXT.FEARLESS_CHAT_Q2, TEXT.FEARLESS_CHAT_Q3],
    },
    {text: TEXT.FEARLESS_CHAT_COMPANION_INFO},
    {heading: TEXT.FEARLESS_CHAT_WHY_IMPORTANT, text: TEXT.FEARLESS_CHAT_SUBCONSCIOUS},
    {text: TEXT.FEARLESS_CHAT_CANT_SOLVE, style: 'italic'},
    {text: TEXT.FEARLESS_CHAT_WEAKENS},
    {text: TEXT.FEARLESS_CHAT_REGISTERS},
    {text: TEXT.FEARLESS_CHAT_NEED_HELP, style: 'italic'},
    {text: TEXT.FEARLESS_CHAT_DIFF_PRINCIPLE},
    {bullets: [TEXT.FEARLESS_CHAT_P1, TEXT.FEARLESS_CHAT_P2, TEXT.FEARLESS_CHAT_P3]},
    {text: TEXT.FEARLESS_CHAT_GROWTH},
    {text: TEXT.FEARLESS_CHAT_NO_REPLACE},
    {heading: TEXT.FEARLESS_CHAT_KEEP_IN_MIND},
    {text: TEXT.FEARLESS_CHAT_VIDEO_FIRST},
    {text: TEXT.FEARLESS_CHAT_INTRODUCE},
    {text: TEXT.FEARLESS_CHAT_VOICE_MSG},
    {text: TEXT.FEARLESS_CHAT_VOICE_LIMIT},
    {text: TEXT.FEARLESS_CHAT_NO_TEXT},
    {
      heading: TEXT.FEARLESS_CHAT_BE_CLEAR,
      bullets: [TEXT.FEARLESS_CHAT_CLEAR_Q1, TEXT.FEARLESS_CHAT_CLEAR_Q2],
    },
    {text: TEXT.FEARLESS_CHAT_TARGETED},
    {text: TEXT.FEARLESS_CHAT_ANY_TIME},
    {text: TEXT.FEARLESS_CHAT_REPLY_TIME},
    {heading: TEXT.FEARLESS_CHAT_NOTE, text: TEXT.FEARLESS_CHAT_NOTE_TEXT},
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{TEXT.FEARLESS_CHAT_TITLE}</Text>
          <Text style={styles.subtitle}>{TEXT.FEARLESS_CHAT_SUBTITLE}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator>
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              {section.heading && <Text style={styles.heading}>{section.heading}</Text>}
              {section.text && (
                <Text style={[styles.bodyText, section.style === 'italic' && styles.italicText]}>
                  {section.text}
                </Text>
              )}
              {section.bullets && (
                <View style={styles.bulletContainer}>
                  {section.bullets.map((bullet, bIndex) => (
                    <View key={bIndex} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          <View style={{height: readOnly ? 80 : 150}} />
        </ScrollView>

        <View style={styles.bottomContainer}>
          {!readOnly ? (
            <>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsChecked(!isChecked)}
                activeOpacity={0.7}>
                <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
                  {isChecked && <Text style={styles.tickMark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{TEXT.FEARLESS_CHAT_CHECKBOX}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.startButton, isChecked ? styles.startButtonActive : styles.startButtonDisabled]}
                onPress={() => { if (isChecked && onStartChat) onStartChat(); }}
                disabled={!isChecked}
                activeOpacity={0.7}>
                <Text style={[styles.startButtonText, isChecked ? styles.startButtonTextActive : styles.startButtonTextDisabled]}>
                  {TEXT.FEARLESS_CHAT_START}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
              <Text style={styles.closeButtonText}>{TEXT.FEARLESS_CHAT_CLOSE}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ChatRulesModal;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  header: {backgroundColor: COLORS.SECONDARY_COLOR, paddingVertical: 20, paddingHorizontal: 20, alignItems: 'center'},
  title: {fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4},
  subtitle: {fontSize: 14, color: '#E0C0E0'},
  scrollView: {flex: 1, paddingHorizontal: 20},
  section: {marginTop: 16},
  heading: {fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 6},
  bodyText: {fontSize: 14, lineHeight: 22, color: '#444444'},
  italicText: {fontStyle: 'italic', color: '#666666'},
  bulletContainer: {marginTop: 4},
  bulletRow: {flexDirection: 'row', marginBottom: 6, paddingRight: 10},
  bulletDot: {fontSize: 14, color: COLORS.SECONDARY_COLOR, marginRight: 8, marginTop: 1},
  bulletText: {fontSize: 14, lineHeight: 22, color: '#444444', flex: 1},
  bottomContainer: {paddingHorizontal: 20, paddingBottom: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E0E0E0', backgroundColor: '#FFFFFF'},
  checkboxRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14},
  checkboxBox: {width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: '#999999', marginRight: 10, marginTop: 1, justifyContent: 'center', alignItems: 'center'},
  checkboxBoxChecked: {borderColor: COLORS.SECONDARY_COLOR, backgroundColor: COLORS.SECONDARY_COLOR},
  tickMark: {color: '#FFFFFF', fontSize: 14, fontWeight: '700'},
  checkboxLabel: {fontSize: 14, color: '#333333', flex: 1, lineHeight: 20},
  startButton: {paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
  startButtonActive: {backgroundColor: COLORS.SECONDARY_COLOR},
  startButtonDisabled: {backgroundColor: '#E0E0E0'},
  startButtonText: {fontSize: 16, fontWeight: '600'},
  startButtonTextActive: {color: '#FFFFFF'},
  startButtonTextDisabled: {color: '#999999'},
  closeButton: {paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.SECONDARY_COLOR},
  closeButtonText: {fontSize: 16, fontWeight: '600', color: '#FFFFFF'},
});