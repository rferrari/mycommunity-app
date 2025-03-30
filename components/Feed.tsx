import React from 'react';
import { View, RefreshControl, FlatList } from 'react-native';
import { Text } from './ui/text';
import { PostCard } from './feed/PostCard';
import type { Post } from '../lib/types';
import { LoadingScreen } from './ui/LoadingScreen';
import { useColorScheme } from '~/lib/useColorScheme';
import { getFeed } from '~/lib/api';
import { useAuth } from '~/lib/auth-provider';

interface FeedProps {
  refreshTrigger?: number;
  pollInterval?: number; // in milliseconds
}

export function Feed({ refreshTrigger = 0, pollInterval = 30000 }: FeedProps) {
  const [feedData, setFeedData] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const { username } = useAuth();

  const fetchFeed = React.useCallback(async () => {
    return getFeed();
  }, []);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchFeed();
    setFeedData(data);
    setIsRefreshing(false);
  }, [fetchFeed]);

  // Set up polling
  React.useEffect(() => {
    const pollTimer = setInterval(async () => {
      const newData = await fetchFeed();
      if (newData.length > 0) {
        setFeedData(newData);
      }
    }, pollInterval);
    return () => clearInterval(pollTimer);
  }, [fetchFeed, pollInterval]);

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

  React.useEffect(() => {
    setIsLoading(true);
    console.info('Fetching feed data');
    fetchFeed()
      .then(data => {
        if (data) {
          setFeedData(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, [fetchFeed, refreshTrigger]);

  // Get theme colors
  const foregroundColor = isDarkColorScheme ? '#ffffff' : '#000000';
  const backgroundColor = isDarkColorScheme ? '#1a1a1a' : '#ffffff';

  // Prepare the content view component
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
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
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

  // Return the appropriate view based on loading state
  return isLoading ? <LoadingScreen /> : contentView;
}
