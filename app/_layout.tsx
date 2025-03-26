import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '~/global.css';
import { useColorScheme } from '~/lib/useColorScheme';

const TAB_ITEMS = [
  {
    name: 'index',
    title: 'Feed',
    icon: 'home-outline'
  },
  {
    name: 'magazine',
    title: 'Mag',
    icon: 'cloud-download-outline'
  },
  {
    name: 'skatefeed',
    title: 'SkateFeed',
    icon: 'cloud-download-outline'
  },
  {
    name: 'fetch',
    title: 'Fetch', 
    icon: 'cloud-download-outline'
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: 'person-outline'
  }
] as const;

export default function TabLayout() {
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
