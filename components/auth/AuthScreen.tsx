import React from 'react';
import { View, Animated, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '../ui/loading-effects/MatrixRain';
import { LoginForm } from './LoginForm';
import { PathSelection } from './PathSelection';
import { Toast } from '../ui/toast';
import { useAuth } from '~/lib/auth-provider';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { height } = Dimensions.get('window');

export function AuthScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const { storedUsers, login, loginStoredUser, enterSpectatorMode, deleteAllStoredUsers } = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState<'error' | 'success' | 'info'>('error');
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsVisible(true);
  }, []);

  const handleSpectator = async () => {
    try {
      await enterSpectatorMode();
      
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          500,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );
      setIsVisible(false);
      
      setTimeout(() => {
        router.push('/(tabs)/feed');
      }, 500);
    } catch (error) {
      console.error('Error entering spectator mode:', error);
      setMessage('Error entering spectator mode');
      setMessageType('error');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!username || !password) {
        setMessage('Please enter both username and posting key');
        setMessageType('error');
        return;
      }

      await login(username, password);

      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          500,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );
      setIsVisible(false);
      
      setTimeout(() => {
        router.push('/(tabs)/feed');
      }, 500);
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Invalid credentials');
      setMessageType('error');
    }
  };

  const handleQuickLogin = async (selectedUsername: string) => {
    try {
      await loginStoredUser(selectedUsername);
      router.push('/(tabs)/feed');
    } catch (error) {
      console.error('Error with quick login:', error);
      setMessage('Error logging in');
      setMessageType('error');
    }
  };

  const handleDeleteAllUsers = async () => {
    try {
      await deleteAllStoredUsers();
      setMessage('All users deleted successfully');
      setMessageType('success');
    } catch (error) {
      console.error('Error deleting users:', error);
      setMessage('Error deleting users');
      setMessageType('error');
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
      {message && (
        <Toast 
          message={message} 
          type={messageType}
          onHide={() => setMessage('')}
        />
      )}
      <MatrixRain />
      <View className="flex-1 items-center justify-center p-8">
        {!showLogin ? (
          <PathSelection
            storedUsers={storedUsers}
            onLogin={() => setShowLogin(true)}
            onSpectator={handleSpectator}
            onQuickLogin={handleQuickLogin}
            onDeleteAllUsers={handleDeleteAllUsers}
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