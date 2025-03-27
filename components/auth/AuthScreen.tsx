import React from 'react';
import { View, Animated, Pressable, Dimensions, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../ui/text';
import { Input } from '../ui/input';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '../ui/loading-effects/MatrixRain';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { height } = Dimensions.get('window');
const STORED_USERS_KEY = 'stored_users';

export function AuthScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [showLogin, setShowLogin] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [storedUsers, setStoredUsers] = React.useState<string[]>([]);
  const [isVisible, setIsVisible] = React.useState(false);

  // Fetch stored users on mount
  React.useEffect(() => {
    const getStoredUsers = async () => {
      try {
        const storedUsersJson = await SecureStore.getItemAsync(STORED_USERS_KEY);
        const lastUser = await SecureStore.getItemAsync('lastLoggedInUser');
        
        let users: string[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
        
        if (lastUser) {
          users = users.filter(user => user !== lastUser);
          users.unshift(lastUser);
        }

        setStoredUsers(users);
        
        // Configure and trigger entrance animation
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsVisible(true);
      } catch (error) {
        console.error('Error fetching stored users:', error);
      }
    };
    getStoredUsers();
  }, []);

  const handleSpectator = async () => {
    try {
      await SecureStore.setItemAsync('lastLoggedInUser', 'SPECTATOR');
      
      // Configure exit animation
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          500,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );
      setIsVisible(false);
      
      // Navigate after animation
      setTimeout(() => {
        router.push('/(tabs)/home');
      }, 500);
    } catch (error) {
      console.error('Error setting spectator mode:', error);
    }
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const updateStoredUsers = async (username: string) => {
    try {
      let users = [...storedUsers];
      
      // Remove username if it already exists
      users = users.filter(user => user !== username);
      // Add username to the beginning
      users.unshift(username);
      
      // Update state
      setStoredUsers(users);
      
      // Save to storage
      await SecureStore.setItemAsync(STORED_USERS_KEY, JSON.stringify(users));
      await SecureStore.setItemAsync('lastLoggedInUser', username);
    } catch (error) {
      console.error('Error updating stored users:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!username || !password) {
        setMessage('Please enter both username and posting key');
        return;
      }

      const normalizedUsername = username.toLowerCase().trim();

      // Save credentials
      await SecureStore.setItemAsync(normalizedUsername, password);
      // Update stored users list
      await updateStoredUsers(normalizedUsername);

      // Configure exit animation
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          500,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );
      setIsVisible(false);
      
      // Navigate after animation
      setTimeout(() => {
        router.push('/(tabs)/home');
      }, 500);
    } catch (error) {
      console.error('Error saving credentials:', error);
      setMessage('Error saving credentials');
    }
  };

  const handleQuickLogin = async (selectedUsername: string) => {
    try {
      const storedPassword = await SecureStore.getItemAsync(selectedUsername);
      if (storedPassword) {
        // Update stored users order
        await updateStoredUsers(selectedUsername);
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
    <View className="w-full max-w-sm">
      <ScrollView 
        className="max-h-[200px]"
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        {storedUsers
            .filter(user => user !== "SPECTATOR")
            .map((user, index) => (
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
                {'@' + user} {/* Changed to concatenate inside Text component */}
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
    <View 
      className="absolute inset-0 bg-background"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: [{ translateY: isVisible ? 0 : height }]
      }}
    >
      <MatrixRain />
      <View className="flex-1 items-center justify-center p-8">
        {!showLogin ? (
          <View className="w-full max-w-sm space-y-8">
            <Text className="text-4xl font-bold text-center text-foreground mb-8">
              Choose Your Path
            </Text>
            
            {storedUsers.length > 0 && (
              <View className="mb-8"> {/* Added margin bottom */}
                <Text>
                  <StoredUsersView />
                </Text>
              </View>
            )}

            <View className="space-y-4">
              <Pressable
                onPress={handleLogin}
                className="bg-foreground px-8 py-4 rounded-lg"
              >
                <Text className="text-xl font-bold text-center text-background">
                  New Login
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSpectator}
                className="bg-foreground/10 px-8 py-4 rounded-lg"
              >
                <Text className="text-xl font-bold text-center text-foreground">
                  Enter as Spectator
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
              className="bg-foreground px-8 py-4 rounded-lg"
            >
              <Text className="text-xl font-bold text-center text-background">
                Submit
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}