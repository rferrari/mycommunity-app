import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const handleCloseWallet = () => {
  router.push('/(tabs)/feed');
};

export default function WalletHomePage() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Ionicons 
              name="volume-high-outline" 
              size={24} 
              color={isDarkColorScheme ? '#ffffff' : '#000000'} 
            />
            <Pressable
            >
            <Text className="text-xl font-bold ml-2">
              Exit?
            </Text>
            </Pressable>
          </View>

          {/* Settings Sections */}
          <View className="space-y-6">
            <View className="bg-foreground/5 rounded-lg p-4">
            <Pressable
            onPress={handleCloseWallet}>
              <Text className="text-lg font-bold mb-4">
                Go back
              </Text>
              </Pressable>
            </View>
          </View>

{/* Settings Sections */}
<View className="space-y-6">
            <View className="bg-foreground/5 rounded-lg p-4">
              <Text className="text-lg font-bold mb-4">
              Continue
              </Text>
            </View>
          </View>

          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
