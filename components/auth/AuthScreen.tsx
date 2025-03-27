import React from 'react';
import { View, Animated, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '../ui/loading-effects/MatrixRain';
import * as SecureStore from 'expo-secure-store';
import { LoginForm } from './LoginForm';
import { PathSelection } from './PathSelection';

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
        
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsVisible(true);
      } catch (error) {
        console.error('Error fetching stored users:', error);
      }
    };
    getStoredUsers();
  }, []);

  const updateStoredUsers = async (username: string) => {
    try {
      let users = [...storedUsers];
      users = users.filter(user => user !== username);
      users.unshift(username);
      setStoredUsers(users);
      await SecureStore.setItemAsync(STORED_USERS_KEY, JSON.stringify(users));
      await SecureStore.setItemAsync('lastLoggedInUser', username);
    } catch (error) {
      console.error('Error updating stored users:', error);
    }
  };

  const handleSpectator = async () => {
    try {
      await SecureStore.setItemAsync('lastLoggedInUser', 'SPECTATOR');
      
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          500,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );
      setIsVisible(false);
      
      setTimeout(() => {
        router.push('/(tabs)/home');
      }, 500);
    } catch (error) {
      console.error('Error setting spectator mode:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!username || !password) {
        setMessage('Please enter both username and posting key');
        return;
      }

      const normalizedUsername = username.toLowerCase().trim();
      await SecureStore.setItemAsync(normalizedUsername, password);
      await updateStoredUsers(normalizedUsername);

      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          500,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );
      setIsVisible(false);
      
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
          <PathSelection
            storedUsers={storedUsers}
            onLogin={() => setShowLogin(true)}
            onSpectator={handleSpectator}
            onQuickLogin={handleQuickLogin}
            isDarkColorScheme={isDarkColorScheme}
          />
        ) : (
          <LoginForm
            username={username}
            password={password}
            message={message}
            onUsernameChange={(text) => setUsername(text.toLowerCase())}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            isDarkColorScheme={isDarkColorScheme}
          />
        )}
      </View>
    </View>
  );
}