import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

export default function WelcomeScreen() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
  <View className="flex-1 p-6">
    <View className="flex-1 items-center justify-center space-y-8">
      <Ionicons 
        name="bicycle-outline" 
        size={100} 
        color={isDarkColorScheme ? '#ffffff' : '#000000'} 
      />
      
      <View className="space-y-4">
        <Text className="text-4xl font-bold text-center">
          Welcome to SkateHive!
        </Text>
        <Text className="text-lg text-center opacity-70">
          Let's make your first post and show the world your moves! 🛹🔥
        </Text>
      </View>

      <Button 
        onPress={() => router.push('/(editortabs)/write')}
        className="bg-foreground w-full"
      >
        <Text className="text-xl font-bold text-background">
          Start Posting 🚀
        </Text>
      </Button>
    </View>
  </View>
</SafeAreaView>

  );
}