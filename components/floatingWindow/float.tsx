import React from 'react';
import { View, Animated, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '../ui/loading-effects/MatrixRain';
import { Toast } from '../ui/toast';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { height } = Dimensions.get('window');

export function FloatScreen({ children }: { children: React.ReactNode }) {
  const { isDarkColorScheme } = useColorScheme();
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState<'error' | 'success' | 'info'>('error');
  const [isVisible, setIsVisible] = React.useState(true);

  const handleSomething = async () => {
  };

  return (
    <View 
      className="absolute inset-0 bg-background"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: [{ translateY: isVisible ? 0 : height }]
      }}
    >
      {message && (
        <Toast 
          message={message} 
          type={messageType}
          onHide={() => setMessage('')}
        />
      )}
      <MatrixRain />
      <View className="flex-1 items-center justify-center p-8">
        {children}
      </View>
    </View>
  );
}