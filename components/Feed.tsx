import React from 'react';
import { View } from 'react-native';
import { Text } from './ui/text';
import { PostCard } from './feed/PostCard';
import { API_BASE_URL } from '~/lib/constants';
import type { Post } from './feed/types';

export function Feed() {
  const [feedData, setFeedData] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/feed`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setFeedData(data.data);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (isLoading) {
    return (
      <View className="w-full items-center justify-center p-4 bg-background">
        <Text className="text-foreground">Loading posts...</Text>
      </View>
    );
  }

  return (
    <View className="w-full gap-4">
      <Text className="text-2xl font-bold mb-2">Latest Posts</Text>
      {feedData.map((post) => (
        <PostCard key={post.permlink} post={post} />
      ))}
    </View>
  );
}