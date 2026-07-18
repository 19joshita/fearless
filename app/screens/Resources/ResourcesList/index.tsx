import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {AppHeader, AppImage, AppLabel, AppView} from '@global-components';
import {useLazyGetResourcesQuery} from '@redux/resources-api-slice';
import styles from './styles';
import {COLORS, SPACING, scaleWidth} from '@theme';
import {navigate} from '@navigation-utils';
import {RouteNames} from '@utils';
import {useText} from '@localization';
import {ChatEmpty} from '@components';
import ChatPrompts from '../../../components/Chat/ChatPrompts';
import {
  ASSIATANTS,
  PromptType,
} from '../../../components/Chat/ChatEmpty/assitants';
import {useAppSelector} from '@redux/reduxHook';

const PAGE_LIMIT = 10;

interface ResourceListProps {
  onPromptPress?: (propmp: PromptType) => void;
}
const ResourcesList: FC<ResourceListProps> = ({onPromptPress}) => {
  const [page, setPage] = useState(1);
  const [resources, setResources] = useState<Resource[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const {TEXT} = useText();
  const [triggerGetResources, {data, isFetching, isLoading, error}] =
    useLazyGetResourcesQuery({refetchOnReconnect: true});
  const [totalCount, setTotalCount] = useState<number>(0);
  const currentLanguage = useAppSelector(state => state?.app?.currentLanguage);
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = scaleWidth(128) + SPACING.m;
  const numColumns = Math.max(
    1,
    Math.floor((screenWidth - 2 * SPACING.m + SPACING.m) / itemWidth),
  );

  useEffect(() => {
    fetchResources(page);
  }, []);
  useEffect(() => {
    handleRefresh();
  }, [currentLanguage]);

  const fetchResources = async (pageToFetch: number) => {
    try {
      const res = await triggerGetResources({
        page: pageToFetch,
        limit: PAGE_LIMIT,
      }).unwrap();
      setTotalCount(res?.count || 0);
      const newItems = res?.data ?? [];
      console.log('resources ', res);

      if (newItems?.length > 0) {
        setResources(prev =>
          pageToFetch === 1 ? newItems : [...prev, ...newItems],
        );
      }

      setHasMore(resources.length <= totalCount); // if less, no more pages
    } catch (e) {
      console.error('Failed to fetch:', e);
      setHasMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isFetching && hasMore && resources?.length < totalCount) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResources(nextPage);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchResources(1);
  };

  const listHeaderComponent = () => {
    return (
      // <View style={styles.headerContainer}>
      //   <AppImage imageContainerStyle={styles.headerImage} />
      //   <AppLabel
      //     text={TEXT.FEARLESS_CODE_RESOURCES.toUpperCase()}
      //     textStyle={styles.headerText}
      //   />
      // </View>
      <View style={{paddingBottom: SPACING.m}}>
        <ChatPrompts
          DATA={ASSIATANTS()}
          headingTitle={TEXT.SELECT_AN_ASSISTANT}
          onPromptPress={onPromptPress ? onPromptPress : () => {}}
        />
      </View>
    );
  };

  const renderItem = useCallback(({item}: {item: Resource}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigate(RouteNames.RESOURCES_VIEW, {
            link: item?.type === 'link' ? item?.link : item?.file,
            type: item?.type,
          })
        }
        style={styles.container}>
        <AppImage
          uri={item?.thumbnail}
          imageContainerStyle={styles.imageStyle}
          resizeMode="stretch"
        />
        <AppLabel
          text={
            item?.name || item?.file?.substring(item?.file.lastIndexOf('/') + 1)
          }
          textStyle={styles.textStyle}
        />
      </TouchableOpacity>
    );
  }, []);
  const margin =
    (screenWidth - numColumns * itemWidth) / 4 > 0
      ? (screenWidth - numColumns * itemWidth) / 4
      : 0;
  return (
    <View>
      {/* <AppHeader isLeftIcon={false} title={TEXT.RESOURCES} /> */}
      <FlatList
        data={resources}
        keyExtractor={item => item.uuid}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        numColumns={numColumns}
        contentContainerStyle={{
          // gap: SPACING.custom(20),
          paddingBottom: SPACING.l,
          paddingVertical: SPACING.m,
          paddingHorizontal: SPACING.m,
        }}
        columnWrapperStyle={{
          // justifyContent: 'space-around',
          // backgroundColor: 'red',
          justifyContent: 'space-between',
          flex: 1,
          // gap: SPACING.m,
          marginHorizontal: margin,
        }}
        refreshing={isFetching && page === 1}
        onRefresh={handleRefresh}
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <ActivityIndicator style={{marginVertical: 20}} />
          ) : null
        }
        ListEmptyComponent={
          isLoading || isFetching ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SPACING.m,
              }}>
              <ActivityIndicator
                size={'large'}
                color={COLORS.SECONDARY_COLOR}
              />
            </View>
          ) : !isFetching && !resources.length ? (
            <AppLabel
              textAlign="center"
              text={TEXT.FEARLESS_CODE_RESOURCE_MESSAGE}
              textStyle={{paddingVertical: SPACING.l}}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        style={{paddingTop: SPACING.s}}
      />
    </View>
  );
};

export default ResourcesList;
