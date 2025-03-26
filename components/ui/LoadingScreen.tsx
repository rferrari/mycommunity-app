import React from 'react';
import { View, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { Text } from './text';
import { useColorScheme } from '~/lib/useColorScheme';
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

const { width, height } = Dimensions.get('window');

export function LoadingScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const foregroundColor = isDarkColorScheme ? '#ffffff' : '#000000';
  const [loadingMessage, setLoadingMessage] = React.useState<(typeof LOADING_MESSAGES)[number]>(LOADING_MESSAGES[0]);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const BackgroundEffect = getLoadingEffect("matrix").component;

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
    <View style={{ width, height }} className="bg-background">
      <BackgroundEffect />
      <View className="absolute inset-0 items-center justify-center">
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
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              LOADING
            </Animated.Text>
            <Animated.Text 
              className="text-3xl font-medium"
              style={{ 
                color: foregroundColor,
                opacity: fadeAnim 
              }}
            >
              {loadingMessage}
            </Animated.Text>
          </View>
        </View>
      </View>
    </View>
  );
}