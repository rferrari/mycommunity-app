import React from 'react';
import { View, RefreshControl, FlatList, ActivityIndicator, Pressable, Animated } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Text } from './ui/text';
import { PostCard } from './feed/PostCard';
import type { Post } from './feed/types';
import { API_BASE_URL } from '~/lib/constants';
import { LoadingScreen } from './ui/LoadingScreen';
import { useColorScheme } from '~/lib/useColorScheme';
import { preloadedData } from '~/app/index';

interface FeedProps {
  refreshTrigger?: number;
  pollInterval?: number; // in milliseconds
}

export function Feed({ refreshTrigger = 0, pollInterval = 30000 }: FeedProps) {
  const [feedData, setFeedData] = React.useState<Post[]>([]);
  const [newPosts, setNewPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [username, setUsername] = React.useState<string | null>(null);
  const { isDarkColorScheme } = useColorScheme();
  const notificationOpacity = React.useRef(new Animated.Value(0)).current;

  // Get current user
  React.useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await SecureStore.getItemAsync('lastLoggedInUser');
        setUsername(currentUser);
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getCurrentUser();
  }, []);

  const fetchFeed = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/snaps`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data as Post[];
      }
      return [] as Post[];
    } catch (error) {
      console.error('Error fetching snaps:', error);
      return [] as Post[];
    }
  }, []);

  const checkForNewPosts = React.useCallback(async () => {
    const newData = await fetchFeed();
    if (newData.length > 0) {
      const existingIds = new Set(feedData.map((post: Post) => post.permlink));
      const newItems = newData.filter((post: Post) => !existingIds.has(post.permlink));
      
      if (newItems.length > 0) {
        setNewPosts(newItems);
        // Animate notification
        Animated.sequence([
          Animated.timing(notificationOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [feedData, notificationOpacity]);

  const showNewPosts = React.useCallback(() => {
    setFeedData(prev => [...newPosts, ...prev]);
    setNewPosts([]);
    Animated.timing(notificationOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [newPosts, notificationOpacity]);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchFeed();
    setFeedData(data);
    setNewPosts([]);
    setIsRefreshing(false);
  }, [fetchFeed]);

  // Set up polling
  React.useEffect(() => {
    const pollTimer = setInterval(checkForNewPosts, pollInterval);
    return () => clearInterval(pollTimer);
  }, [checkForNewPosts, pollInterval]);

  // Initial fetch
  React.useEffect(() => {
    setIsLoading(true);
    fetchFeed()
      .then(data => setFeedData(data))
      .finally(() => setIsLoading(false));
  }, [fetchFeed, refreshTrigger]);

  const renderItem = React.useCallback(({ item }: { item: Post }) => (
    <PostCard key={item.permlink} post={item} currentUsername={username} />
  ), [username]);

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


  const NewPostsNotification = React.useCallback(() => (
    <Animated.View 
      style={{ opacity: notificationOpacity }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <Pressable
        onPress={showNewPosts}
        className="mx-4 mt-4 p-3 bg-primary rounded-lg flex-row justify-center items-center"
      >
        <Text className="text-white font-medium">
          {newPosts.length} new {newPosts.length === 1 ? 'post' : 'posts'} available
        </Text>
      </Pressable>
    </Animated.View>
  ), [newPosts.length, notificationOpacity, showNewPosts]);

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
    <View className="flex-1">
      <NewPostsNotification />
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
