import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Animated, Pressable, useColorScheme, View } from 'react-native';
import { Post } from '~/lib/types';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { API_BASE_URL } from '~/lib/constants';

// Create a global cache for preloaded data with proper typing
export const preloadedData = {
  feed: null as Post[] | null,
  trending: null as Post[] | null,
};

const BackgroundVideo = () => {
  const player = useVideoPlayer(require('../assets/videos/background.mov'), player => {
    player.loop = true;
    player.play();
  });

  return (
    <View className="absolute inset-0">
      <VideoView
        style={{ width: '100%', height: '100%' }}
        contentFit='cover'
        player={player}
      />
      <View className="absolute inset-0 bg-black/20" />
    </View>
  );
};

export default function Index() {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === 'dark';

  React.useEffect(() => {
    const preloadData = async () => {
      try {
        const startTime = Date.now();
        const [feedPromise, trendingPromise] = [
          fetch(`${API_BASE_URL}/feed`),
          fetch(`${API_BASE_URL}/feed/trending`),
        ];

        feedPromise.then(async response => {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            preloadedData.feed = data.data;
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.info(`Feed loaded in ${elapsed}s:`, data.data.length, 'items');
          }
        });

        trendingPromise.then(async response => {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            preloadedData.trending = data.data;
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.info(`Trending loaded in ${elapsed}s:`, data.data.length, 'items');
          }
        });

        await Promise.all([feedPromise, trendingPromise]);
      } catch (error) {
        console.error('Preload error:', error);
      }
    };

    const checkLastUser = async () => {
      try {
        const manualQuit = await SecureStore.getItemAsync('manualQuit');
        if (manualQuit === 'true') {
          await SecureStore.deleteItemAsync('manualQuit');
          return;
        }

        const lastLoggedInUser = await SecureStore.getItemAsync('lastLoggedInUser');
        if (lastLoggedInUser && lastLoggedInUser !== 'SPECTATOR') {
          router.push('/(tabs)/feed');
        }
      } catch (error) {
        console.error('Error checking last user:', error);
      }
    };

    checkLastUser();
    preloadData();
  }, []);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    router.push('/login');
  };

  const handleInfoPress = () => {
    router.push('/about');
  };

  return (
    <View className="flex-1 bg-background">
      <BackgroundVideo />
      <Pressable
        onPress={handleInfoPress}
        className="absolute top-12 right-6 z-10"
      >
        <View className="bg-foreground/20 rounded-full p-2">
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={isDarkColorScheme ? '#ffffff' : '#000000'}
          />
        </View>
      </Pressable>

      <View className="flex-1 items-center justify-end pb-8 px-4">
        <Button className="font-bold w-full opacity-95 border border-muted-foreground" size={"xl"} onPress={handlePress}>
          <Text>
            Login in / Sign up
          </Text>
        </Button>
        <Text className='text-sm text-foreground/50 mt-2'>
          Alpha
        </Text>
      </View>
    </View>
  );
}