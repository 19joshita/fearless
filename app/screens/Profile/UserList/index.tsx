import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Modal,
  DeviceEventEmitter,
} from 'react-native';
import {AppView, ChatHeader} from '@components';
import {useText} from '@localization';
import {navigate} from '@navigation-utils';
import {RouteNames} from '@utils';
import {COLORS, FONT_FAMILY, scaleSize, SPACING} from '@theme';
import {
  useDeleteConversationMutation,
  useGetAdminConversationsQuery,
  useLazyGetAdminConversationsQuery,
  useMarkConversationAsReadMutation,
  supportChatSlice,
} from '@redux/support-chat-slice';
import {store} from '@redux/store';

// ✅ NEW: Import the hook and its type (Adjust path if needed)
import {
  useAdminListSocket,
  AdminConversationPayload,
} from '../../../hooks/useAdminListSocket';

// ==================== TYPES ====================
interface AdminConversationUser {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  role?: string;
}

interface AdminConversation {
  conversation_id: number;
  user: AdminConversationUser | null;
  last_message: {
    message: string;
    message_type: string;
    sender_type: string;
    created_at: string;
  } | null;
  unread_count: number;
  status: string;
}

// ==================== COMPONENT ====================
const UserList = () => {
  const {TEXT} = useText();
  const [page, setPage] = useState(1);
  const limit = 20;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ NEW: Initialize the Admin List Socket
  const {isConnected: isSocketConnected} = useAdminListSocket();

  const {
    data: conversationsData,
    isFetching,
    isLoading,
  } = useGetAdminConversationsQuery({page, limit});

  const [triggerRefresh] = useLazyGetAdminConversationsQuery();
  const [markAsRead] = useMarkConversationAsReadMutation();
  const [deleteConversation, {isLoading: isDeleting}] =
    useDeleteConversationMutation();

  const allConversations: AdminConversation[] = conversationsData?.data ?? [];

  // ✅ UPDATED: Filter out admins AND conversations with null last_message
  const conversations = allConversations.filter(c => {
    const isAdmin =
      c?.user?.email === 'admin@admin.com' ||
      c?.user?.name === 'Fearless Admin';
    const hasNoMessage = !c?.last_message;
    return !isAdmin && !hasNoMessage;
  });

  const handleNewConversationCreated = useCallback(
    (data: AdminConversationPayload) => {
      if (!data.last_message) return;
      if (
        data.user?.email === 'admin@admin.com' ||
        data.user?.name === 'Fearless Admin'
      )
        return;

      store.dispatch(
        supportChatSlice.util.updateQueryData(
          'getAdminConversations',
          {page: 1, limit},
          (draft: any) => {
            if (!draft.data) draft.data = [];
            const exists = draft.data.some(
              (c: any) => c.conversation_id === data.conversation_id,
            );
            if (!exists) {
              draft.data.unshift(data);
            }
          },
        ),
      );
    },
    [limit],
  );
  const handleConversationUpdated = useCallback(
    (data: AdminConversationPayload) => {
      store.dispatch(
        supportChatSlice.util.updateQueryData(
          'getAdminConversations',
          {page: 1, limit},
          (draft: any) => {
            if (!draft.data) return;

            const index = draft.data.findIndex(
              (c: any) => c.conversation_id === data.conversation_id,
            );

            if (index !== -1) {
              // Merge new data (updates last_message and unread_count)
              draft.data[index] = {...draft.data[index], ...data};
              // Remove from current position
              const [updatedItem] = draft.data.splice(index, 1);
              // Move to top of list
              draft.data.unshift(updatedItem);
            } else {
              // If it wasn't in the list for some reason, add it
              if (data.last_message) {
                draft.data.unshift(data);
              }
            }
          },
        ),
      );
    },
    [limit],
  );

  // =========================================================================
  // ✅ 3. SOCKET EVENT: CONVERSATION DELETED (Remove from list)
  // =========================================================================
  const handleConversationDeleted = useCallback(
    (data: AdminConversationPayload) => {
      store.dispatch(
        supportChatSlice.util.updateQueryData(
          'getAdminConversations',
          {page: 1, limit},
          (draft: any) => {
            if (!draft.data) return;
            draft.data = draft.data.filter(
              (c: any) => c.conversation_id !== data.conversation_id,
            );
          },
        ),
      );
    },
    [limit],
  );

  // =========================================================================
  // ✅ SUBSCRIBE TO ALL 3 SOCKET EVENTS
  // =========================================================================
  useEffect(() => {
    const sub1 = DeviceEventEmitter.addListener(
      'NEW_CONVERSATION_CREATED',
      handleNewConversationCreated,
    );
    const sub2 = DeviceEventEmitter.addListener(
      'CONVERSATION_UPDATED',
      handleConversationUpdated,
    );
    const sub3 = DeviceEventEmitter.addListener(
      'CONVERSATION_DELETED',
      handleConversationDeleted,
    );

    return () => {
      sub1.remove();
      sub2.remove();
      sub3.remove();
    };
  }, [
    handleNewConversationCreated,
    handleConversationUpdated,
    handleConversationDeleted,
  ]);

  // =========================================================================
  // NORMAL LIST LOGIC
  // =========================================================================
  const handleLoadMore = () => {
    if (
      !isFetching &&
      !isRefreshing &&
      allConversations.length === page * limit
    ) {
      setPage(prev => prev + 1);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    store.dispatch(
      supportChatSlice.util.updateQueryData(
        'getAdminConversations',
        {page: 1, limit},
        draft => {
          draft.data = [];
        },
      ),
    );

    try {
      await triggerRefresh({page: 1, limit});
      setPage(1);
    } catch (error) {
      console.log('Refresh Error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleSelectUser = async (item: AdminConversation) => {
    if ((item?.unread_count ?? 0) > 0) {
      // 1. Call API
      markAsRead({conversation_id: item?.conversation_id?.toString() ?? ''});

      // ✅ 2. OPTIMISTIC UPDATE: Instantly remove badge in Global RTK Cache
      store.dispatch(
        supportChatSlice.util.updateQueryData(
          'getAdminConversations',
          {page: 1, limit},
          (draft: any) => {
            if (!draft.data) return;
            const index = draft.data.findIndex(
              (c: any) => c.conversation_id === item.conversation_id,
            );
            if (index !== -1) {
              draft.data[index].unread_count = 0;
            }
          },
        ),
      );
    }

    navigate(RouteNames.SUPPORT_CHAT, {
      mode: 'admin',
      conversationId: item?.conversation_id?.toString() ?? '',
      userName: item?.user?.name ?? 'Unknown User',
    });
  };
  const handleLongPress = (conversationId: number) => {
    if (conversationId == null) return;
    setSelectedConversationId(conversationId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedConversationId) return;

    try {
      //@ts-ignore
      await deleteConversation({
        conversationId: selectedConversationId,
      }).unwrap();
      setShowDeleteModal(false);
      setSelectedConversationId(null);
    } catch (error) {
      console.log('Delete Error:', error);
      setShowDeleteModal(false);
    }
  };

  // --- Formatters ---
  const formatTime = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
    return date.toLocaleDateString([], {day: '2-digit', month: '2-digit'});
  };

  const getMessagePreview = (item: AdminConversation): string => {
    if (!item?.last_message) return '';
    const prefix = item.last_message.sender_type === 'admin' ? 'You: ' : '';
    if (item.last_message.message_type === 'image') return `${prefix}📷 Photo`;
    if (item.last_message.message_type === 'audio') return `${prefix}🎤 Audio`;
    if (item.last_message.message_type === 'video') return `${prefix}🎥 Video`;
    return `${prefix}${item.last_message.message ?? ''}`;
  };

  // --- Render User Item (WhatsApp Style) ---
  const renderUserItem = ({
    item,
    index,
  }: {
    item: AdminConversation;
    index: number;
  }) => {
    const isUnread = (item?.unread_count ?? 0) > 0;
    const initials = (item?.user?.name ?? 'U')
      .split(' ')
      .map(n => n?.[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => handleSelectUser(item)}
        onLongPress={() => handleLongPress(item?.conversation_id ?? 0)}
        delayLongPress={400}
        style={[
          styles.rowContainer,
          index === conversations.length - 1 && styles.lastItemBorder,
        ]}>
        <View style={styles.avatarWrapper}>
          {item?.user?.profile_image ? (
            <Image
              source={{uri: item.user.profile_image}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}

          {isUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {(item?.unread_count ?? 0) > 99 ? '99+' : item?.unread_count}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.topRow}>
            <Text
              numberOfLines={1}
              style={[styles.nameText, isUnread && styles.unreadNameText]}>
              {item?.user?.name ?? 'Unknown User'}
            </Text>
            <Text style={[styles.timeText, isUnread && styles.unreadTimeText]}>
              {formatTime(item?.last_message?.created_at)}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.messageText,
                isUnread && styles.unreadMessageText,
              ]}>
              {getMessagePreview(item)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (isRefreshing) return null;
    if (isFetching) {
      return (
        <ActivityIndicator
          style={{paddingVertical: SPACING.m}}
          size="small"
          color={COLORS.SECONDARY_COLOR}
        />
      );
    }
    return null;
  };

  return (
    <AppView
      customViewStyle={{paddingBottom: 0, backgroundColor: COLORS.WHITE_COLOR}}>
      <ChatHeader
        isLeftIcon={true}
        title={TEXT.USER_LIST || 'Support Chats'}
        onlayout={() => {}}
        isRightLastIcon={false}
      />
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.SECONDARY_COLOR} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item?.conversation_id?.toString()}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !isRefreshing ? (
              <View style={[styles.center, {flex: 1}]}>
                <Text style={styles.emptyText}>No user conversations yet</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* ==================== DELETE MODAL ==================== */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDeleteModal(false)}>
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Delete Conversation?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this whole conversation? This
              action cannot be undone.
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteButton, isDeleting && {opacity: 0.6}]}
                onPress={handleDelete}
                disabled={isDeleting}>
                {isDeleting ? (
                  <ActivityIndicator size="small" color={COLORS.WHITE_COLOR} />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </AppView>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  listContainer: {
    marginTop: 4,
    padding: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE_COLOR,
  },
  emptyText: {
    color: COLORS.GRAY_TEXT_COLOR,
    fontSize: scaleSize(15),
    fontFamily: FONT_FAMILY.Medium,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s + SPACING.xxs,
    borderBottomWidth: scaleSize(1),
    borderBottomColor: COLORS.LIGHT_BORDER_COLOR,
  },
  lastItemBorder: {
    borderBottomWidth: 0,
  },
  avatarWrapper: {
    marginRight: SPACING.m,
    position: 'relative',
  },
  avatar: {
    width: scaleSize(52),
    height: scaleSize(52),
    borderRadius: scaleSize(26),
    backgroundColor: COLORS.TABS_BG,
  },
  avatarPlaceholder: {
    width: scaleSize(52),
    height: scaleSize(52),
    borderRadius: scaleSize(26),
    backgroundColor: COLORS.SECONDARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.WHITE_COLOR,
    fontSize: scaleSize(18),
    fontFamily: FONT_FAMILY.Semibold,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: scaleSize(-2),
    right: scaleSize(-2),
    backgroundColor: COLORS.SECONDARY_COLOR,
    borderRadius: scaleSize(10),
    minWidth: scaleSize(20),
    height: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scaleSize(2),
    borderColor: COLORS.WHITE_COLOR,
  },
  badgeText: {
    color: COLORS.WHITE_COLOR,
    fontSize: scaleSize(11),
    fontFamily: FONT_FAMILY.Bold,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameText: {
    flex: 1,
    fontSize: scaleSize(16),
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.TEXT_COLOR,
    marginRight: SPACING.xs,
  },
  timeText: {
    fontSize: scaleSize(12),
    fontFamily: FONT_FAMILY.Regular,
    color: COLORS.GRAY_TEXT_COLOR,
  },
  messageText: {
    fontSize: scaleSize(14),
    fontFamily: FONT_FAMILY.Medium,
    color: COLORS.GRAY_TEXT_COLOR,
    flex: 1,
  },
  unreadNameText: {
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.TEXT_COLOR,
  },
  unreadTimeText: {
    color: COLORS.SECONDARY_COLOR,
    fontFamily: FONT_FAMILY.Semibold,
  },
  unreadMessageText: {
    color: COLORS.TEXT_COLOR,
    fontFamily: FONT_FAMILY.Medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: scaleSize(16),
    padding: SPACING.l,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: scaleSize(18),
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.TEXT_COLOR,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: scaleSize(14),
    fontFamily: FONT_FAMILY.Regular,
    color: COLORS.GRAY_TEXT_COLOR,
    textAlign: 'center',
    lineHeight: scaleSize(22),
    marginBottom: SPACING.xl,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  cancelButton: {
    flex: 1,
    height: scaleSize(48),
    borderRadius: scaleSize(12),
    backgroundColor: COLORS.TABS_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: scaleSize(15),
    fontFamily: FONT_FAMILY.Semibold,
    color: COLORS.TEXT_COLOR,
  },
  deleteButton: {
    flex: 1,
    height: scaleSize(48),
    borderRadius: scaleSize(12),
    backgroundColor: COLORS.ERROR_PROGRESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: scaleSize(15),
    fontFamily: FONT_FAMILY.Semibold,
    color: COLORS.WHITE_COLOR,
  },
});

export default UserList;
