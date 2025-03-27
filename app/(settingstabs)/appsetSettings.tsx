import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function AppSettings() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={isDarkColorScheme ? '#ffffff' : '#000000'} 
            />
            <Text className="text-xl font-bold ml-2">
              App Settings
            </Text>
          </View>

          {/* Settings Sections */}
          <View className="space-y-6">
            {/* General Settings Section */}
            <View className="bg-foreground/5 rounded-lg p-4">
              <Text className="text-lg font-bold mb-4">
                General Settings
              </Text>
              
              <View className="space-y-4">
                {/* Example setting item */}
                <View className="flex-row justify-between items-center">
                  <Text>Dark Mode</Text>
                  {/* Add toggle or control component */}
                </View>
              </View>
            </View>

            {/* Notifications Section */}
            <View className="bg-foreground/5 rounded-lg p-4">
              <Text className="text-lg font-bold mb-4">
                Notifications
              </Text>
              
              {/* Add notification settings here */}
            </View>

            {/* Privacy Section */}
            <View className="bg-foreground/5 rounded-lg p-4">
              <Text className="text-lg font-bold mb-4">
                Privacy
              </Text>
              
              {/* Add privacy settings here */}
            </View>

            {/* About Section */}
            <View className="bg-foreground/5 rounded-lg p-4">
              <Text className="text-lg font-bold mb-4">
                About
              </Text>
              
              <View className="space-y-2">
                <Text>Version: 1.0.0</Text>
                <Text>Build: 2024.03.26</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}