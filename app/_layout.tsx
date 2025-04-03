import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '~/global.css';
import { AuthProvider } from '~/lib/auth-provider';
import { ToastProvider } from '~/lib/toast-provider';

// Initialize the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
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
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
