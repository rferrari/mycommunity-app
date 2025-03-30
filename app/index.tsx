import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Animated, Pressable, useColorScheme, View } from 'react-native';
import { AuthScreen } from '~/components/auth/AuthScreen';
import { Post } from '~/lib/types';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { API_BASE_URL } from '~/lib/constants';
// import { LoadingScreen } from '~/components/ui/LoadingScreen';
import { getLoadingEffect } from '~/components/ui/loading-effects';

// Create a global cache for preloaded data with proper typing
export const preloadedData = {
  feed: null as Post[] | null,
  trending: null as Post[] | null,
  // magazine: null as Post[] | null,
  // snaps: null as Post[] | null,
  // to do: others
};


export default function Index() {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [showAuth, setShowAuth] = React.useState(false);

  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === 'dark';

  const BackgroundEffect = getLoadingEffect("video").component;

  React.useEffect(() => {
    const preloadData = async () => {
      try {
        const startTime = Date.now();

        // Start both requests in parallel but track them separately
        const [
          feedPromise,
          trendingPromise,
          // magazinePromise, 
          // snapsPromise
        ] = [
            fetch(`${API_BASE_URL}/feed`),
            fetch(`${API_BASE_URL}/feed/trending`),
            // fetch(`${API_BASE_URL}/magazine`),
            // fetch(`${API_BASE_URL}/snaps`)
          ];

        // Handle feed request
        feedPromise.then(async response => {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            preloadedData.feed = data.data;
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.info(`Feed loaded in ${elapsed}s:`, data.data.length, 'items');
          }
        });

        // Handle trending request
        trendingPromise.then(async response => {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            preloadedData.trending = data.data;
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.info(`Trending loaded in ${elapsed}s:`, data.data.length, 'items');
          }
        });

        // // Update preload data contents every 5 minutes
        // setInterval(async () => {
        //   const [
        //     feedPromise,
        //     trendingPromise,
        //     // magazinePromise, 
        //     // snapsPromise
        //   ] = [
        //       fetch(`${API_BASE_URL}/feed`),
        //       fetch(`${API_BASE_URL}/feed/trending`),
        //       // fetch(`${API_BASE_URL}/magazine`),
        //       // fetch(`${API_BASE_URL}/snaps`)
        //     ];
        //   try {
        //     const response = await feedPromise;
        //     const data = await response.json();
        //     if (data.success && Array.isArray(data.data)) {
        //       preloadedData.feed = data.data;
        //       const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        //       console.info(`Feed updated in ${elapsed}s:`, data.data.length, 'items');
        //     }
        //   } catch (error) {
        //     console.error('Error fetching Feed contents:', error);
        //   }

        //   try {
        //     const response = await trendingPromise;
        //     const data = await response.json();
        //     if (data.success && Array.isArray(data.data)) {
        //       preloadedData.trending = data.data;
        //       const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        //       console.info(`Trending updated in ${elapsed}s:`, data.data.length, 'items');
        //     }
        //   } catch (error) {
        //     console.error('Error fetching Trending contents:', error);
        //   }

        // }, 5 * 60 * 1000); // 5 minutes in milliseconds

        // // Handle magazine request
        // magazinePromise.then(async response => {
        //   const data = await response.json();
        //   if (data.success && Array.isArray(data.data)) {
        //     preloadedData.magazine = data.data;
        //     const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        //     console.info(`Magazine loaded in ${elapsed}s:`, data.data.length, 'items');
        //   }
        // });

        // // Handle snaps request
        // snapsPromise.then(async response => {
        //   const data = await response.json();
        //   if (data.success && Array.isArray(data.data)) {
        //     preloadedData.snaps = data.data;
        //     const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        //     console.info(`Snaps loaded in ${elapsed}s:`, data.data.length, 'items');
        //   }
        // });

        // Still wait for both to complete to catch any errors
        await Promise.all([
          feedPromise,
          trendingPromise,
          // magazinePromise, 
          // snapsPromise
        ]);

      } catch (error) {
        console.error('Preload error:', error);
      }
    };

    const checkLastUser = async () => {
      try {
        // Check if user manually quit
        const manualQuit = await SecureStore.getItemAsync('manualQuit');
        if (manualQuit === 'true') {
          // Clear the flag and don't auto-login
          await SecureStore.deleteItemAsync('manualQuit');
          return;
        }

        const lastLoggedInUser = await SecureStore.getItemAsync('lastLoggedInUser');
        if (lastLoggedInUser && lastLoggedInUser !== 'SPECTATOR') {
          // If we have a real user (not spectator), go directly to home
          router.push('/(tabs)/feed');
        }
      } catch (error) {
        console.error('Error checking last user:', error);
      }
    };

    // Check last user when component mounts
    checkLastUser();

    // Start preloading data as well
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
    setShowAuth(true);
  };

  const handleInfoPress = () => {
    router.push('/about');
  };

  return (
    <View className="flex-1 bg-background">
      {/* <BackgroundVideo /> */}
      {/* <LoadingScreen /> */}
      <BackgroundEffect />
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
      {showAuth && <AuthScreen />}
    </View>
  );
}