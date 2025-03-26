import React from 'react';
import { View, RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import { Text } from './ui/text';
import { PostCard } from './feed/PostCard';
import type { Post } from './feed/types';
import { API_BASE_URL } from '~/lib/constants';
import { LoadingScreen } from './ui/LoadingScreen';
import { useColorScheme } from '~/lib/useColorScheme';
import { preloadedData } from '~/app/index';

interface FeedProps {
  refreshTrigger?: number;
}

export function Feed({ refreshTrigger = 0 }: FeedProps) {
  const [feedData, setFeedData] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { isDarkColorScheme } = useColorScheme();

  const fetchFeed = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feed`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setFeedData(data.data);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  }, []);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await fetchFeed();
    setIsRefreshing(false);
  }, [fetchFeed]);

  const renderItem = React.useCallback(({ item }: { item: Post }) => (
    <PostCard key={item.permlink} post={item} />
  ), []);

  const keyExtractor = React.useCallback((item: Post) => item.permlink, []);

  const ListHeaderComponent = React.useCallback(() => (
    <Text className="text-2xl font-bold mb-4 px-4">Latest Posts</Text>
  ), []);

  const ItemSeparatorComponent = React.useCallback(() => (
    <View className="h-0 my-4 border-b-muted border" />
  ), []);

  React.useEffect(() => {
    // If we have preloaded data, use it immediately without loading screen
    if (preloadedData.feed) {
      console.info('Using preloaded feed data:', preloadedData.feed.length);
      setFeedData(preloadedData.feed);
    } else {
      // Only show loading screen if we need to fetch
      setIsLoading(true);
      console.info('No preloaded data, fetching feed');
      fetchFeed().finally(() => setIsLoading(false));
    }
  }, [fetchFeed, refreshTrigger]);

  // Get theme colors
  const foregroundColor = isDarkColorScheme ? '#ffffff' : '#000000';
  const backgroundColor = isDarkColorScheme ? '#1a1a1a' : '#ffffff';

  // Prepare the loading view component
  const loadingView = (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <View className="items-center space-y-6">
        <ActivityIndicator 
          size="large" 
          color={foregroundColor} 
        />
        <View className="items-center">
          <Text 
            className="text-4xl font-bold mb-2"
            style={{ color: foregroundColor }}
          >
            LOADING
          </Text>
          <Text 
            className="text-2xl font-medium animate-pulse"
            style={{ color: foregroundColor }}
          >
            Kicking-flip-in...
          </Text>
        </View>
      </View>
    </View>
  );

  // Prepare the content view component
  const contentView = (
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
  );

  // Return the appropriate view based on loading state
  return isLoading ? <LoadingScreen /> : contentView;
}