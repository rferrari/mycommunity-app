import React from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { getTrending } from "~/lib/api";
import { useAuth } from "~/lib/auth-provider";
import { useColorScheme } from "~/lib/useColorScheme";
import type { Post } from "../lib/types";
import { PostCard } from "./feed/PostCard";
import { Text } from "./ui/text";
import { LoadingScreen } from "./ui/LoadingScreen";

interface FeedProps {
  refreshTrigger?: number;
  pollInterval?: number; // in milliseconds
}

export function Trending({
  refreshTrigger = 0,
  pollInterval = 30000,
}: FeedProps) {
  const [feedData, setFeedData] = React.useState<Post[]>([]);
  const [newPosts, setNewPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const { username } = useAuth();
  const notificationOpacity = React.useRef(new Animated.Value(0)).current;

  const fetchFeedTrending = React.useCallback(async () => {
    return getTrending();
  }, []);

  const checkForNewPosts = React.useCallback(async () => {
    const newData = await fetchFeedTrending();
    if (newData.length > 0) {
      const existingIds = new Set(feedData.map((post: Post) => post.permlink));
      const newItems = newData.filter(
        (post: Post) => !existingIds.has(post.permlink)
      );

      if (newItems.length > 0) {
        setNewPosts(newItems);
        Animated.timing(notificationOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [feedData, notificationOpacity]);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchFeedTrending();
    setFeedData(data);
    setNewPosts([]);
    setIsRefreshing(false);
  }, [fetchFeedTrending]);

  React.useEffect(() => {
    const pollTimer = setInterval(checkForNewPosts, pollInterval);
    return () => clearInterval(pollTimer);
  }, [checkForNewPosts, pollInterval]);

  const renderItem = React.useCallback(
    ({ item }: { item: Post }) => (
      <PostCard key={item.permlink} post={item} currentUsername={username} />
    ),
    [username]
  );

  const keyExtractor = React.useCallback((item: Post) => item.permlink, []);

  const ListHeaderComponent = React.useCallback(
    () => <Text className="text-2xl font-bold mb-4 px-4">Trending Posts</Text>,
    []
  );

  const ItemSeparatorComponent = React.useCallback(
    () => <View className="h-0 my-4 border-b-muted border" />,
    []
  );

  React.useEffect(() => {
    setIsLoading(true);
    fetchFeedTrending()
      .then((data) => {
        if (data) {
          setFeedData(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, [fetchFeedTrending, refreshTrigger]);

  const foregroundColor = isDarkColorScheme ? "#ffffff" : "#000000";
  const backgroundColor = isDarkColorScheme ? "#1a1a1a" : "#ffffff";

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

  return isLoading ? <LoadingScreen /> : contentView;
}
