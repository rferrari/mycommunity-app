import React from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import { Text } from './text';
import { useColorScheme } from '~/lib/useColorScheme';
// import { LOADING_EFFECT } from '@env';
import { getLoadingEffect } from './loading-effects';

const LOADING_MESSAGES = [
  'Kicking-flip-in...',
  'Gearing up...',
  'Landing that trick...',
  'Grinding the rails...',
  'Dropping in...',
  'Mastering the half-pipe...',
  'Performing a 360...',
  'Skating to victory...',
  'Rolling forward...',
  'Perfecting that ollie...',
] as const;

export function LoadingScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const foregroundColor = isDarkColorScheme ? '#ffffff' : '#000000';
  const [loadingMessage, setLoadingMessage] = React.useState<(typeof LOADING_MESSAGES)[number]>(LOADING_MESSAGES[0]);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const BackgroundEffect = getLoadingEffect("skate").component;

  React.useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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

    // Message change with fade animation
    const interval = setInterval(() => {
      Animated.sequence([
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        // Change text and fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
      setLoadingMessage(LOADING_MESSAGES[randomIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <BackgroundEffect />
      <View className="items-center space-y-6">
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <ActivityIndicator 
            size="large" 
            color={foregroundColor} 
          />
        </Animated.View>
        <View className="items-center">
          <Animated.Text 
            className="text-6xl font-bold mb-4"
            style={[
              { color: foregroundColor },
              { textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4
              }
            ]}
          >
            LOADING
          </Animated.Text>
          <Animated.Text 
            className="text-3xl font-medium"
            style={[
              { color: foregroundColor },
              { textShadowColor: 'rgba(0, 0, 0, 0.2)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2
              }
            ]}
          >
            {loadingMessage}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}