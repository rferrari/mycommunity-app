import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { VideoPlayer } from '~/components/Feed/VideoPlayer';
import Icon from 'react-native-vector-icons/FontAwesome';


const handleCloseScreen = () => {
  router.push('/(tabs)/profile');
};


export default function WaitlistScreen() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="flex-row items-center">
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
              Close
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

          <View className="space-y-4 mt-10">
            <Text className="text-4xl font-bold text-center">
              How to Join SkateHive
            </Text>
            <Text className="text-lg text-center opacity-70">
              Skatehive is a global community that unites skaters, content creators, and enthusiasts to share, learn, and collaborate.
            </Text>
          </View>

          <View style={{ width: '100%', aspectRatio: 4 / 3 }} className='mt-8 mb-8'>
            <VideoPlayer
              url={'https://ipfs.skatehive.app/ipfs/QmYuM1h51bddDuC44FoAQYp9FRF2CghCncULeS4T3bp727'}
              playing={false}
            />
          </View>

          <View className="space-y-14 mt-10">
            <Text className="text-2xl font-bold text-center">
              Take the next step in this evolution
            </Text>
          </View>

          <View className="space-y-4 mt-10">
            <Text className="text-4xl font-bold text-center">
              Find us
            </Text>
            <View className="flex-row space-x-6">
              <Icon name="twitter" size={40} color="#1DA1F2" />
              <Icon name="instagram" size={40} color="#E4405F" />
              {/* <Icon name="facebook" size={40} color="#1877F2" /> */}
              <Icon name="github" size={40} color="#333" />
            </View>
          </View>
          

        </View>
      </View>
    </SafeAreaView>

  );
}