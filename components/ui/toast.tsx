import React from 'react';
import { Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from './text';

const { width } = Dimensions.get('window');

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onHide?: () => void;
}

export function Toast({ message, type = 'error', onHide }: ToastProps) {
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      // Slide in
      Animated.spring(translateY, {
        toValue: 50,
        useNativeDriver: true,
        tension: 20,
        friction: 5
      }),
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();

    // Auto hide after delay
    const timer = setTimeout(() => {
      hideToast();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => onHide?.());
  };

  const backgroundColor = {
    error: 'bg-red-500/90',
    success: 'bg-green-500/90',
    info: 'bg-blue-500/90'
  }[type];

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={hideToast}>
      <Animated.View
        className={`absolute z-50 top-0 left-0 right-0 mx-4 rounded-lg shadow-lg ${backgroundColor}`}
        style={{
          transform: [{ translateY }],
          opacity,
          width: width - 32,
        }}
      >
        <Text className="text-white px-4 py-3 text-center font-medium text-base">
          {message}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}