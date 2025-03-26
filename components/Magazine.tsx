import React from 'react';
import { View, RefreshControl, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from './ui/text';
import { PostCard } from './magazine/PostCard';
import { API_BASE_URL } from '~/lib/constants';
import { LoadingScreen } from './ui/LoadingScreen';
import type { Post } from './magazine/types';

interface MagazineProps {
  refreshTrigger?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function Magazine({ refreshTrigger = 0 }: MagazineProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [feedData, setFeedData] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchFeed = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/magazine`);
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
    <View style={{ width: SCREEN_WIDTH }}>
      <PostCard post={item} />
    </View>
  ), []);

  const keyExtractor = React.useCallback((item: Post) => item.permlink, []);

  const ItemSeparatorComponent = React.useCallback(() => null, []);

  React.useEffect(() => {
    setIsLoading(true);
    fetchFeed().finally(() => setIsLoading(false));
  }, [fetchFeed, refreshTrigger]);

  // Theme colors
  const foregroundColor = isDarkColorScheme ? '#ffffff' : '#000000';
  const backgroundColor = isDarkColorScheme ? '#1a1a1a' : '#ffffff';

  // Prepare the loading view component
  const loadingView = (
    <View className="w-full items-center justify-center p-4 bg-background">
      <ActivityIndicator size="large" color={foregroundColor} />
      <Text className="text-foreground mt-2">Gearing Up!!!</Text>
    </View>
  );

  // Prepare the content view component
  const contentView = (
    <View className="flex-1">
      {/* Fixed header */}
      <Text className="text-2xl font-bold px-4 py-2">
        Magazine
      </Text>

      {/* Horizontal scrolling content */}
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={feedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
        initialNumToRender={2}
        maxToRenderPerBatch={1}
        windowSize={3}
        updateCellsBatchingPeriod={50}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
      />
    </View>
  );

  // Return the appropriate view based on loading state
  return isLoading ? <LoadingScreen /> : contentView;
}