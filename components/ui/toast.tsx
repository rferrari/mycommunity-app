import React from 'react';
import { Animated, Dimensions } from 'react-native';
import { Text } from './text';

const { width } = Dimensions.get('window');

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onHide?: () => void;
}

export function Toast({ message, type = 'error', onHide }: ToastProps) {
  const translateY = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.sequence([
      // Slide in
      Animated.spring(translateY, {
        toValue: 50,
        useNativeDriver: true,
        tension: 20,
        friction: 5
      }),
      // Wait
      Animated.delay(2000),
      // Slide out
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => onHide?.());
  }, [message]);

  const backgroundColor = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <Animated.View
      className={`absolute z-50 top-0 left-0 right-0 mx-4 rounded-lg ${backgroundColor}`}
      style={{
        transform: [{ translateY }],
        width: width - 32,
      }}
    >
      <Text className="text-white px-4 py-3 text-center font-medium">
        {message}
      </Text>
    </Animated.View>
  );
}