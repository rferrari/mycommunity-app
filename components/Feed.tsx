import React from 'react';
import { View, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { Text } from './ui/text';
import { PostCard } from './feed/PostCard';
import type { Post } from '../lib/types';
import { LoadingScreen } from './ui/LoadingScreen';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/lib/auth-provider';
import { useFeed, useTrending } from '~/lib/hooks/useQueries';
import { Clock } from '~/lib/icons/Clock';
import { TrendingUp } from '~/lib/icons/TrendingUp';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
  useSharedValue,
  Easing
} from 'react-native-reanimated';

type FeedMode = 'latest' | 'trending';

interface FeedProps {
  refreshTrigger?: number;
}

export function Feed({ refreshTrigger = 0 }: FeedProps) {
  const [feedMode, setFeedMode] = React.useState<FeedMode>('latest');
  const { isDarkColorScheme } = useColorScheme();
  const { username } = useAuth();
  
  // Animation progress value
  const scale = useSharedValue(1);
  
  // Fetch both data sources
  const { 
    data: latestData, 
    isLoading: isLatestLoading, 
    refetch: refetchLatest, 
    isRefetching: isLatestRefetching 
  } = useFeed();
  
  const { 
    data: trendingData, 
    isLoading: isTrendingLoading, 
    refetch: refetchTrending, 
    isRefetching: isTrendingRefetching 
  } = useTrending();

  // Determine which data to show based on the current mode
  const feedData = feedMode === 'latest' ? latestData : trendingData;
  const isLoading = feedMode === 'latest' ? isLatestLoading : isTrendingLoading;
  const refetch = feedMode === 'latest' ? refetchLatest : refetchTrending;
  const isRefetching = feedMode === 'latest' ? isLatestRefetching : isTrendingRefetching;

  const handleToggle = React.useCallback(() => {
    // Subtle scale animation
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Toggle feed mode
    setFeedMode(current => current === 'latest' ? 'trending' : 'latest');
  }, []);

  const renderItem = React.useCallback(({ item }: { item: Post }) => (
    <PostCard key={item.permlink} post={item} currentUsername={username} />
  ), [username]);

  const keyExtractor = React.useCallback((item: Post) => item.permlink, []);

  const title = feedMode === 'latest' ? 'Latest Posts' : 'Trending Posts';

  const ListHeaderComponent = React.useCallback(() => (
    <View className="flex-row items-center justify-between mb-4 px-3">
      <Text className="text-3xl font-bold">{title}</Text>
    </View>
  ), [title]);

  const ItemSeparatorComponent = React.useCallback(() => (
    <View className="h-0 my-4 border border-muted" />
  ), []);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const ToggleButton = React.useMemo(() => (
    <View className="absolute right-2 top-4 z-10" style={{ overflow: 'visible' }}>
      <Animated.View 
        className={`rounded-full bg-card shadow-md ${
          isDarkColorScheme ? 'shadow-black/40' : 'shadow-black/20'
        } border border-muted/20`}
        style={buttonAnimatedStyle}
      >
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleToggle}
          className="h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${feedMode === 'latest' ? 'trending' : 'latest'} posts`}
        >
          {feedMode === 'latest' ? (
            <Clock size={24} className="text-primary" />
          ) : (
            <TrendingUp size={24} className="text-primary" />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  ), [feedMode, isDarkColorScheme, handleToggle, buttonAnimatedStyle]);

  // Get theme colors
  const foregroundColor = isDarkColorScheme ? '#ffffff' : '#000000';
  const backgroundColor = isDarkColorScheme ? '#1a1a1a' : '#ffffff';

  const contentView = (
    <View className="flex-1">
      {ToggleButton}
      <FlatList
        data={feedData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={{ paddingTop: 16 }}
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
