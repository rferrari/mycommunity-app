import { View, Animated, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from '~/components/ui/text';
import React from 'react';
import { MatrixRain } from '~/components/ui/loading-effects/MatrixRain';
import { API_BASE_URL } from '~/lib/constants';
import type { Post } from '~/components/magazine/types';
import { AuthScreen } from '~/components/auth/AuthScreen';

// Create a global cache for preloaded data with proper typing
export const preloadedData = {
  feed: null as Post[] | null,
  magazine: null as Post[] | null,
};

export default function Index() {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [showAuth, setShowAuth] = React.useState(false);

  React.useEffect(() => {
    const preloadData = async () => {
      try {
        const startTime = Date.now();
        
        // Start both requests in parallel but track them separately
        const [feedPromise, magazinePromise] = [
          fetch(`${API_BASE_URL}/feed`),
          fetch(`${API_BASE_URL}/magazine`)
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

        // Handle magazine request
        magazinePromise.then(async response => {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            preloadedData.magazine = data.data;
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.info(`Magazine loaded in ${elapsed}s:`, data.data.length, 'items');
          }
        });

        // Still wait for both to complete to catch any errors
        await Promise.all([feedPromise, magazinePromise]);

      } catch (error) {
        console.error('Preload error:', error);
      }
    };

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

  return (
    <View className="flex-1 bg-background">
      <MatrixRain />
      <View className="flex-1 items-center justify-center">
        <View className="items-center space-y-8">
          <Text className="text-6xl font-bold text-foreground">
            MyCommunity
          </Text>
          <Pressable onPress={handlePress}>
            <Animated.View 
              className="bg-foreground px-8 py-4 rounded-lg"
              style={{
                transform: [{ scale: pulseAnim }]
              }}
            >
              <Text className="text-2xl font-bold text-background">
                START
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
      {showAuth && <AuthScreen />}
    </View>
  );
}