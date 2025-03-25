import React from 'react';
import { View, RefreshControl, ScrollView } from 'react-native';
import { Text } from './ui/text';
import { PostCard } from './feed/PostCard';
import { API_BASE_URL } from '~/lib/constants';
import type { Post } from './feed/types';

interface FeedProps {
  refreshTrigger?: number;
}

export function Feed({ refreshTrigger = 0 }: FeedProps) {
  const [feedData, setFeedData] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

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

  React.useEffect(() => {
    setIsLoading(true);
    fetchFeed().finally(() => setIsLoading(false));
  }, [fetchFeed, refreshTrigger]);

  if (isLoading) {
    return (
      <View className="w-full items-center justify-center p-4 bg-background">
        <Text className="text-foreground">Loading posts...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor="hsl(var(--foreground))"
          colors={["hsl(var(--foreground))"]}
          progressBackgroundColor="hsl(var(--background))"
        />
      }
    >
      <View className="w-full gap-4 px-4">
        <Text className="text-2xl font-bold mb-2">Latest Posts</Text>
        {feedData.map((post) => (
          <PostCard key={post.permlink} post={post} />
        ))}
      </View>
    </ScrollView>
  );
}