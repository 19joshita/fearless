import {
  View,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import React, {FC, memo, useMemo, useState} from 'react';
import styles from './styles';
import {
  ICON_BACK,
  ICON_DELETE,
  ICON_EDIT_CHAT,
  ICON_GLOBE,
  ICON_INFO,
  ICON_PLUS,
  ICON_SAVE,
  ICON_UPLOAD,
} from '@assets/icons';
import {goBack, navigate} from '@navigation-utils';
import {AppContextMenu, AppLabel} from '@global-components';
import {ChatHeaderProps} from './types';
import {useText} from '@localization';
import {RouteNames} from '@utils';

const ChatHeader: FC<ChatHeaderProps> = ({
  title,
  isLeftIcon = true,
  isRightIcon = true,
  status,
  customLeftIcon,
  customRightIcon,
  onLeftIconClick,
  onRightIconClick,
  onDeletePress,
  onEditChatPress,
  onExportPress,
  onSavePress,
  isDisabled = false,
  customStyle,
  onlayout,
  isRightLastIcon = true,
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const {TEXT} = useText();

  const contextMenuData = useMemo(
    () => [
      {
        label: TEXT.EXPORT_AS_PDF,
        icon: <ICON_UPLOAD />,
        onPress: onExportPress,
      },
      {
        label: TEXT.EDIT_CHAT_NAME,
        icon: <ICON_EDIT_CHAT />,
        onPress: onEditChatPress,
      },
      {
        label: TEXT.SAVE,
        icon: <ICON_SAVE />,
        onPress: onSavePress,
      },
      {
        label: TEXT.DELETE,
        icon: <ICON_DELETE />,
        onPress: onDeletePress,
      },
    ],
    [onExportPress, onEditChatPress, onSavePress, onDeletePress],
  );
  console.log(status, 'status');
  return (
    <>
      <View
        style={[styles.container, customStyle]}
        onLayout={event => onlayout(event?.nativeEvent?.layout?.height || 0)}>
        {isLeftIcon ? (
          <TouchableOpacity
            hitSlop={20}
            onPress={() => (onLeftIconClick ? onLeftIconClick() : goBack())}
            style={styles.leftIcon}>
            {customLeftIcon ? customLeftIcon : <ICON_BACK />}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            hitSlop={20}
            onPress={() => navigate(RouteNames.APP_INFO)}
            style={styles.leftIcon}>
            {customLeftIcon ? customLeftIcon : <ICON_INFO />}
          </TouchableOpacity>
        )}

        <View style={styles.titleWrapper}>
          <AppLabel
            text={title || 'Header'}
            textStyle={styles.titleStyle}
            numberOfLines={1}
          />

          {status && (
            <Text
              style={[
                styles.statusText,
                status === 'online'
                  ? styles.statusOnline
                  : styles.statusOffline,
              ]}>
              {status === 'online' ? 'Online' : 'Offline'}
            </Text>
          )}
        </View>

        {isRightIcon && (
          <View style={[styles.row, styles.rightIcon]}>
            <TouchableOpacity
              onPress={() => navigate(RouteNames.LANGUAGE_STACK)}>
              <ICON_GLOBE />
            </TouchableOpacity>

            {isRightLastIcon && (
              <>
                <TouchableOpacity
                  onPress={() => setIsMenuVisible(prev => !prev)}>
                  <ICON_PLUS />
                </TouchableOpacity>
                {isMenuVisible && (
                  <AppContextMenu
                    position="bottom"
                    menuData={contextMenuData}
                    onClose={() => setIsMenuVisible(false)}
                  />
                )}
              </>
            )}
          </View>
        )}
      </View>

      {isMenuVisible && (
        <Pressable
          style={[StyleSheet.absoluteFill, {zIndex: 1}]}
          onPress={() => setIsMenuVisible(false)}
        />
      )}
    </>
  );
};

export default memo(ChatHeader);
