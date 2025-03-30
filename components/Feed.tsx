import React from 'react';
import { View, RefreshControl, FlatList } from 'react-native';
import { Text } from './ui/text';
import { PostCard } from './feed/PostCard';
import type { Post } from '../lib/types';
import { LoadingScreen } from './ui/LoadingScreen';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/lib/auth-provider';
import { useFeed } from '~/lib/hooks/useQueries';

interface FeedProps {
  refreshTrigger?: number;
}

export function Feed({ refreshTrigger = 0 }: FeedProps) {
  const { isDarkColorScheme } = useColorScheme();
  const { username } = useAuth();
  const { data: feedData, isLoading, refetch, isRefetching } = useFeed();

  const renderItem = React.useCallback(({ item }: { item: Post }) => (
    <PostCard key={item.permlink} post={item} currentUsername={username} />
  ), [username]);

  const keyExtractor = React.useCallback((item: Post) => item.permlink, []);

  const ListHeaderComponent = React.useCallback(() => (
    <Text className="text-2xl font-bold mb-4 px-4">Feed</Text>
  ), []);

  const ItemSeparatorComponent = React.useCallback(() => (
    <View className="h-0 my-4 border border-muted" />
  ), []);

  // React Query handles the polling internally, so we don't need the polling effect

  // Get theme colors
  const foregroundColor = isDarkColorScheme ? '#ffffff' : '#000000';
  const backgroundColor = isDarkColorScheme ? '#1a1a1a' : '#ffffff';

  const contentView = (
    <View className="flex-1">
      <FlatList
        data={feedData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={foregroundColor}
            colors={[foregroundColor]}
            progressBackgroundColor={backgroundColor}
          />
        }
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={3}
        windowSize={7}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );

  return isLoading ? <LoadingScreen /> : contentView;
}
