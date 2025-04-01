import React from "react";
import { Animated, FlatList, RefreshControl, View } from "react-native";
import { useAuth } from "~/lib/auth-provider";
import { useColorScheme } from "~/lib/useColorScheme";
import type { Post } from "~/lib/types";
import { PostCard } from "./PostCard";
import { Text } from "../ui/text";
import { LoadingScreen } from "../ui/LoadingScreen";
import { useFollowing} from "~/lib/hooks/useQueries";

interface FollowingProps {
  refreshTrigger?: number;
}

export function Following({ refreshTrigger = 0 }: FollowingProps) {
  const [newPosts, setNewPosts] = React.useState<Post[]>([]);
  const { isDarkColorScheme } = useColorScheme();
  const { username } = useAuth();
  const notificationOpacity = React.useRef(new Animated.Value(0)).current;
  const { data: feedData, isLoading, refetch, isRefetching } = useFollowing(username || "SPECTATOR");

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
