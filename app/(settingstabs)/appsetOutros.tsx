import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function AppSettingsOthers() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Ionicons 
              name="ellipsis-horizontal" 
              size={24} 
              color={isDarkColorScheme ? '#ffffff' : '#000000'} 
            />
            <Text className="text-xl font-bold ml-2">
              Other Settings
            </Text>
          </View>

          {/* Settings Sections */}
          <View className="space-y-6">
            <View className="bg-foreground/5 rounded-lg p-4">
              <Text className="text-lg font-bold mb-4">
                Additional Options
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
