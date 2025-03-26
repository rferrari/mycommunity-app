import React from 'react';
import { View, Animated, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../ui/text';
import { Input } from '../ui/input';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '../ui/loading-effects/MatrixRain';
import * as SecureStore from 'expo-secure-store';

const { height } = Dimensions.get('window');

export function AuthScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const [showLogin, setShowLogin] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 20,
      friction: 7
    }).start();
  }, []);

  const handleSpectator = () => {
    Animated.timing(slideAnim, {
      toValue: -height,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      router.push('/(tabs)/home');
    });
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleSubmit = async () => {
    try {
      if (!username || !password) {
        setMessage('Please enter both username and posting key');
        return;
      }

      // Save credentials
      await SecureStore.setItemAsync(username, password);
      // Store the last logged in user
      await SecureStore.setItemAsync('lastLoggedInUser', username);

      // Animate and navigate
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        router.push('/(tabs)/home');
      });
    } catch (error) {
      console.error('Error saving credentials:', error);
      setMessage('Error saving credentials');
    }
  };

  return (
    <Animated.View 
      className="absolute inset-0 bg-background"
      style={{ 
        transform: [{ translateY: slideAnim }]
      }}
    >
      <MatrixRain />
      <View className="flex-1 items-center justify-center p-8">
        {!showLogin ? (
          <View className="w-full max-w-sm space-y-8">
            <Text className="text-4xl font-bold text-center text-foreground mb-8">
              Choose Your Path
            </Text>
            <Pressable
              onPress={handleSpectator}
              className="bg-foreground/10 px-8 py-4 rounded-lg mb-4"
            >
              <Text className="text-xl font-bold text-center text-foreground">
                Enter as Spectator
              </Text>
            </Pressable>
            <Pressable
              onPress={handleLogin}
              className="bg-foreground px-8 py-4 rounded-lg"
            >
              <Text className="text-xl font-bold text-center text-background">
                Login
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="w-full max-w-sm space-y-6">
            <Text className="text-4xl font-bold text-center text-foreground mb-8">
              Login
            </Text>
            <Input
              placeholder="Hive Username"
              value={username}
              onChangeText={setUsername}
              className="bg-foreground/10 px-4 py-3 rounded-lg text-foreground"
              placeholderTextColor={isDarkColorScheme ? '#ffffff80' : '#00000080'}
            />
            <Input
              placeholder="Posting Key"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-foreground/10 px-4 py-3 rounded-lg text-foreground"
              placeholderTextColor={isDarkColorScheme ? '#ffffff80' : '#00000080'}
            />
            {message && (
              <Text className="text-sm text-center text-foreground/80">
                {message}
              </Text>
            )}
            <Pressable
              onPress={handleSubmit}
              className="bg-foreground px-8 py-4 rounded-lg mt-4"
            ></Pressable>
              <Text className="text-xl font-bold text-center text-background">
                Submit
              </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}