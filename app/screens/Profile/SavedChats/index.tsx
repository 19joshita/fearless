import {FlatList, ActivityIndicator, RefreshControl, View} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {AppHeader, AppLabel, AppView} from '@global-components';
import {EVENTS} from '@constants';
import {ChatLoader, SavedChatMenu} from '@components';
import {
  useDeleteChatMutation,
  useLazyGetRoomsQuery,
} from '@redux/chat-api-slice';
import {ICON_THREE_DOTS} from '@assets/icons';
import {COLORS, SPACING} from '@theme';
import {Emitter, formatDate, RouteNames} from '@utils';
import Toast from 'react-native-toast-message';
import {navigate} from '@navigation-utils';
import {useText} from '@localization';

const PAGE_LIMIT = 10;

const SavedChat: FC = () => {
  const [page, setPage] = useState(1);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const {TEXT} = useText();

  const [currentVisibleId, setCurrentVisibleId] = useState<string>('');
  const [deleteChat, {isLoading: deleteLoading, isError, isSuccess}] =
    useDeleteChatMutation();
  const [hasMore, setHasMore] = useState(true);

  const [triggerGetRooms, {data, isFetching, isLoading}] =
    useLazyGetRoomsQuery();

  // Fetch paginated data
  const fetchData = async (pageToFetch: number, isRefresh = false) => {
    try {
      const result = await triggerGetRooms(String(pageToFetch)).unwrap();
      console.log('savedChats ', result);
      const fetchedData = result?.data ?? [];
      const countFromAPI = result?.count ?? 0;

      setTotalCount(countFromAPI);

      if (isRefresh || pageToFetch == 1) {
        setRooms(fetchedData);
      } else {
        setRooms(prev => [...prev, ...fetchedData]);
      }

      const currentTotal =
        isRefresh || pageToFetch == 1
          ? fetchedData.length
          : rooms.length + fetchedData.length;

      // const hasMorePages =
      //   currentTotal < countFromAPI && fetchedData.length > 0;
      // setHasMore(hasMorePages);
      setHasMore(fetchedData?.length === PAGE_LIMIT);
    } catch (err) {
      // console.error('Failed to fetch data:', err);
      console.error('Failed to fetch data:', pageToFetch);
      setHasMore(false);
    }
  };

  // Initial load or when page changes
  useEffect(() => {
    if (hasMore || page === 1) {
      fetchData(page);
    }
  }, [page]);
  useEffect(() => {
    Emitter.on(EVENTS.DELETE_SAVED_CHAT, (chatId: string) => {
      setRooms(prev => prev?.filter(room => room.uuid !== chatId));
    });

    Emitter.on(EVENTS.RENAME_SAVED_CHAT, (chat: EditChatResponse['data']) => {
      console.log('rename event ', chat);
      setRooms(prev =>
        prev.map(room =>
          room.uuid === chat.uuid ? {...room, name: chat.name} : room,
        ),
      );
    });
    return () => {
      Emitter.off(EVENTS.DELETE_SAVED_CHAT);
      Emitter.off(EVENTS.RENAME_SAVED_CHAT);
    };
  }, []);
  // Refresh logic
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchData(1, true);
    setHasMore(true);
    setRefreshing(false);
  };

  // Load more handler
  const loadMore = () => {
    if (!isFetching && !isLoading && hasMore && rooms.length >= PAGE_LIMIT) {
      setPage(prev => prev + 1);
    }
  };

  const handleDeleteChat = async (roomId: string) => {
    try {
      const response = await deleteChat(roomId).unwrap();
      if (response?.success) {
        Emitter.emit(EVENTS.DELETE_CHAT, roomId);
        Toast.show({
          text1: response?.message,
          type: 'success',
        });
        // Remove locally
        const updatedRooms = rooms.filter(room => room.uuid !== roomId);
        setRooms(updatedRooms);
        // Update count manually
        setTotalCount(prev => prev - 1);
        // Reset pagination if needed
        if (updatedRooms.length < totalCount - 1) {
          setHasMore(true);
        }
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const renderItem = ({item}: {item: ChatRoom}) => (
    <SavedChatMenu
      onDeletePress={() => handleDeleteChat(item?.uuid)}
      onViewPress={() => {
        // navigate(RouteNames.BOTTOM_TABS, {
        //   screen: RouteNames.CHAT,
        //   params: {
        //     screen: RouteNames.CHAT_TAB,
        //     params: {
        //       savedChatParamsId: item?.uuid,
        //     },
        //   },
        // });
        navigate(RouteNames.CHAT_TAB, {
          savedChatParamsId: item?.uuid,
          savedChatName: item?.name || item?.display_name,
          type: item?.type?.toLowerCase(),
        });
      }}
      title={item?.name}
      date={formatDate(item?.updated_at, 'short')}
      icon={ICON_THREE_DOTS}
      onPress={() =>
        setCurrentVisibleId(prev => (prev === item?.uuid ? '' : item?.uuid))
      }
      contextMenuVisble={currentVisibleId === item?.uuid}
      onChangeMenu={() => setCurrentVisibleId('')}
      isAgent={item?.type === 'agent'}
    />
  );

  return (
    <AppView
      onStartShouldSetResponder={() => {
        if (currentVisibleId) {
          setCurrentVisibleId('');
          return true;
        }
        return false;
      }}>
      <AppHeader title={TEXT.SAVED_CHATS} />
      <FlatList
        // style={{flex: 1}}
        // onTouchStart={() => setCurrentVisibleId('')}
        onScrollBeginDrag={() => setCurrentVisibleId('')}
        onMomentumScrollBegin={() => setCurrentVisibleId('')}
        // onTouchStart={() => setCurrentVisibleId('')}
        data={rooms}
        keyExtractor={useCallback((item: ChatRoom) => item.uuid, [])}
        renderItem={renderItem}
        onEndReached={loadMore}
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <AppLabel
              text={TEXT.NO_CHATS_FOUND}
              textAlign="center"
              textStyle={{marginVertical: SPACING.xxxl}}
            />
          ) : undefined
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching && !refreshing ? (
            <ActivityIndicator
              style={{paddingVertical: SPACING.m}}
              color={COLORS.SECONDARY_COLOR}
            />
          ) : null
        }
        contentContainerStyle={{
          gap: SPACING.s,
          overflow: 'visible',
          paddingBottom: SPACING.xxxl,
          // flex: 1,
          // backgroundColor: 'red',
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.SECONDARY_COLOR]} // Android spinner color
            tintColor={COLORS.SECONDARY_COLOR} // iOS spinner color
          />
        }
      />
      {deleteLoading && (
        <ChatLoader
          isLoadingComponent={true}
          loadingText={TEXT.DELETING_CHAT}
        />
      )}
    </AppView>
  );
};

export default SavedChat;
