import { Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '~/global.css';
import { AuthProvider } from '~/lib/auth-provider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View className="flex-1 bg-background">
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
            initialRouteName="index"
          >
            <Stack.Screen name="index" />
            <Stack.Screen 
              name="(tabs)"
              options={{
                animation: 'fade',
              }}
            />
          </Stack>
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
