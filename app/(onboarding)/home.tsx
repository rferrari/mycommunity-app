import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

const handleCloseScreen = () => {
  router.push('/(tabs)/feed');
};


export default function WaitlistScreen() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={handleCloseScreen}>
            <Ionicons
              name="close-outline"
              size={24}
              color={isDarkColorScheme ? '#ffffff' : '#000000'}
            />
          </Pressable>
          <Pressable
          >
            <Text className="text-xl font-bold ml-2">
              Wait List
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center space-y-8">
          <Ionicons
            name="enter-outline"
            size={100}
            color={isDarkColorScheme ? '#ffffff' : '#000000'}
          />

          <View className="space-y-4">
            <Text className="text-4xl font-bold text-center">
              How to Join SkateHive?
            </Text>
            <Text className="text-lg text-center opacity-70">
            Skatehive is a global community that unites skaters, content creators, and enthusiasts to share, learn, and collaborate. Rooted in a spirit of openness and creativity, Skatehive fosters a space where skaters can connect without barriers, celebrate each other’s achievements, and grow together. With a focus on decentralization, Skatehive empowers its members to be active contributors and shape the direction of the community through their participation.
            </Text>
          </View>

          <View className="space-y-14">
            <Text className="text-4xl font-bold text-center">
              email@email.com.br
            </Text>
            <Text className="text-lg text-center opacity-70">
              
            </Text>
          </View>

        </View>
      </View>
    </SafeAreaView>

  );
}