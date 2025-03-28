import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';

const TAB_ITEMS = [
  {
    name: 'home',
    title: 'Wallet',
    icon: 'apps-outline'
  },
  {
    name: 'invest',
    title: 'Invest',
    icon: 'apps-outline'
  },
  {
    name: 'powerup',
    title: 'Power Up',
    icon: 'apps-outline'
  },
  {
    name: 'send',
    title: 'Send',
    icon: 'apps-outline'
  },
  {
    name: 'receive',
    title: 'Receive',
    icon: 'apps-outline'
  },
  {
    name: 'close',
    title: 'close',
    icon: 'apps-outline'
  }
] as const;

export default function TabSettinsLayout() {
  const { isDarkColorScheme } = useColorScheme();
  
  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-background">
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: isDarkColorScheme ? '#1a1a1a' : '#ffffff',
              },
              tabBarActiveTintColor: isDarkColorScheme ? '#ffffff' : '#000000',
            }}
          >
            {TAB_ITEMS.map((tab) => (
              <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                  title: tab.title,
                  tabBarIcon: ({ color }) => (
                    <TabBarIcon name={tab.icon} color={color} />
                  ),
                }}
              />
            ))}
          </Tabs>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}