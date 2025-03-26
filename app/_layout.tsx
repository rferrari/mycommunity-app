import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '~/global.css';
import { useColorScheme } from '~/lib/useColorScheme';

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  
  const renderTabLabel = (label: string, color: string) => (
    <Text style={{ color }}>{label}</Text>
  );

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
              tabBarInactiveTintColor: isDarkColorScheme ? '#666666' : '#999999',
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                tabBarLabel: ({ color }) => renderTabLabel('Feed', color),
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="home-outline" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="fetch"
              options={{
                tabBarLabel: ({ color }) => renderTabLabel('Fetch', color),
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="cloud-download-outline" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                tabBarLabel: ({ color }) => renderTabLabel('Profile', color),
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="person-outline" color={color} />
                ),
              }}
            />
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
