import {View, TouchableOpacity, Pressable, Text} from 'react-native';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import styles from './styles';
import {AppContextMenu, AppLabel} from '@global-components';
import {
  ICON_DELETE,
  ICON_MESSAGE,
  ICON_THREE_DOTS,
  ICON_VIEW,
} from '@assets/icons';
import {SavedChatMenuProps} from './types';
import {scaleSize, screenHeight, SPACING} from '@theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useText} from '@localization';

const SavedChatMenu: FC<SavedChatMenuProps> = ({
  icon,
  title,
  onPress,
  date,
  contextMenuVisble = false,
  onChangeMenu,
  onDeletePress,
  onViewPress,
  isAgent = false,
}) => {
  const ICON = ICON_MESSAGE;
  const {TEXT} = useText();
  const contextMenuData = useMemo(
    () => [
      {
        label: TEXT.VIEW_CHAT,
        icon: <ICON_VIEW />,
        onPress: onViewPress,
      },
      {
        label: TEXT.DELETE_CHAT,
        icon: <ICON_DELETE />,
        onPress: onDeletePress,
      },
    ],
    [],
  );

  const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);
  const [shouldOpenUp, setShouldOpenUp] = useState<boolean>(false);
  const {bottom} = useSafeAreaInsets();
  useEffect(() => {
    if (contextMenuVisble && buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        const safeScreenHeight = screenHeight;
        const estimatedMenuHeight = scaleSize(120);
        const buffer = 45;
        const shouldOpenUp =
          y + height + estimatedMenuHeight + buffer > safeScreenHeight;

        setShouldOpenUp(shouldOpenUp);
      });
    }
  }, [contextMenuVisble]);

  return (
    <Pressable
      disabled
      onPress={onPress}
      style={[
        styles.flexRow,
        styles.container,
        contextMenuVisble && {
          zIndex: 999,
          elevation: 999,
        },
      ]}>
      <View style={[styles.flexRow, styles.iconTitleContainer]}>
        <View style={styles.iconContainer}>
          <ICON />
        </View>
        <View style={styles.textContanier}>
          <AppLabel textStyle={styles.titleStyle} text={title} />
          <View style={[styles.flexRow, {gap: SPACING.s}]}>
            <AppLabel textStyle={styles.dateStyle} text={date} />
            {isAgent && (
              <>
                <AppLabel text={'|'} textStyle={styles.agentText} />
                <View style={styles.agentTag}>
                  <AppLabel text={TEXT.AGENT} textStyle={styles.agentText} />
                </View>
              </>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity
        ref={buttonRef}
        style={{paddingLeft: SPACING.s}}
        onPress={onPress}>
        <ICON_THREE_DOTS />
      </TouchableOpacity>
      {contextMenuVisble && (
        <>
          <AppContextMenu
            onClose={onChangeMenu}
            menuData={contextMenuData}
            position={shouldOpenUp ? 'top' : 'bottom'}
            customStyle={{
              right: scaleSize(30),
              top: shouldOpenUp ? -scaleSize(80) : scaleSize(50),
              // top: -scaleSize(80),
              elevation: 1000, // For Android
            }}
          />
        </>
      )}
    </Pressable>
  );
};

export default SavedChatMenu;
