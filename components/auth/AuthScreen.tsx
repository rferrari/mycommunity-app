import React from 'react';
import { View, Animated, Pressable, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../ui/text';
import { Input } from '../ui/input';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '../ui/loading-effects/MatrixRain';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export function AuthScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const [showLogin, setShowLogin] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [storedUsers, setStoredUsers] = React.useState<string[]>([]);

  // Fetch stored users on mount
  React.useEffect(() => {
    const getStoredUsers = async () => {
      try {
        const lastUser = await SecureStore.getItemAsync('lastLoggedInUser');
        if (lastUser) {
          setStoredUsers(prev => [...new Set([lastUser, ...prev])]);
        }
        // You might need to implement a way to store/retrieve the list of all users
        // This is just an example using the last logged-in user
      } catch (error) {
        console.error('Error fetching stored users:', error);
      }
    };
    getStoredUsers();
  }, []);

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 20,
      friction: 7
    }).start();
  }, []);

  const handleSpectator = () => {
    // Animated.timing(slideAnim, {
    //   toValue: -height,
    //   duration: 500,
    //   useNativeDriver: true
    // }).start(() => {
    router.push('/(tabs)/home');
    // });
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

      // Convert username to lowercase before saving
      const normalizedUsername = username.toLowerCase().trim();

      // Save credentials with lowercase username
      await SecureStore.setItemAsync(normalizedUsername, password);
      // Store the last logged in user in lowercase
      await SecureStore.setItemAsync('lastLoggedInUser', normalizedUsername);

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

  const handleQuickLogin = async (selectedUsername: string) => {
    try {
      const storedPassword = await SecureStore.getItemAsync(selectedUsername);
      if (storedPassword) {
        await SecureStore.setItemAsync('lastLoggedInUser', selectedUsername);
        router.push('/(tabs)/home');
      } else {
        setMessage('No stored credentials found');
      }
    } catch (error) {
      console.error('Error with quick login:', error);
      setMessage('Error logging in');
    }
  };

  const StoredUsersView = () => (
    <View className="w-full max-w-sm space-y-4">
      <Text className="text-2xl font-bold text-center text-foreground mb-4">
        Stored Accounts
      </Text>
      <ScrollView className="max-h-40">
        {storedUsers.map((user, index) => (
          <Pressable
            key={user}
            onPress={() => handleQuickLogin(user)}
            className="bg-foreground/10 px-6 py-3 rounded-lg mb-2 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons 
                name="person-circle-outline" 
                size={24} 
                color={isDarkColorScheme ? '#ffffff' : '#000000'} 
              />
              <Text className="text-lg font-medium text-foreground ml-2">
                @{user}
              </Text>
            </View>
            <Ionicons 
              name="arrow-forward-outline" 
              size={20} 
              color={isDarkColorScheme ? '#ffffff80' : '#00000080'} 
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

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
            
            {storedUsers.length > 0 && <StoredUsersView />}

            <View className="space-y-4">
              <Pressable
                onPress={handleSpectator}
                className="bg-foreground/10 px-8 py-4 rounded-lg"
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
                  New Login
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="w-full max-w-sm space-y-6">
            <Text className="text-4xl font-bold text-center text-foreground mb-8">
              Login
            </Text>
            <Input
              placeholder="Hive Username"
              value={username}
              onChangeText={(text) => setUsername(text.toLowerCase())} // Convert to lowercase on input
              className="bg-foreground/10 px-4 py-3 rounded-lg text-foreground"
              placeholderTextColor={isDarkColorScheme ? '#ffffff80' : '#00000080'}
              autoCapitalize="none" // Prevent auto-capitalization
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
            >
              <Text className="text-xl font-bold text-center text-background">
                ENTER
              </Text>
            </Pressable>
          </View>
        )}
        
        {message && (
          <Text className="text-sm text-center text-foreground/80 mt-4">
            {message}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}