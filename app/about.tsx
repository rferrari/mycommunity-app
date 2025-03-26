import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '~/components/ui/loading-effects/MatrixRain';

export default function AboutScreen() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-1 bg-background">
      <MatrixRain />
      <View className="flex-1">
        {/* Header with back button */}
        <View className="flex-row items-center p-4 pt-12">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDarkColorScheme ? '#ffffff' : '#000000'} 
            />
          </Pressable>
          <Text className="text-2xl font-bold ml-2">About MyCommunity</Text>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6">
          <View className="space-y-6 py-4">
            <Text className="text-lg">
              MyCommunity is a decentralized social platform that empowers communities
              to connect, share, and grow together.
            </Text>

            <View className="space-y-2">
              <Text className="text-xl font-bold">Features:</Text>
              <Text>• Community-driven content</Text>
              <Text>• Decentralized architecture</Text>
              <Text>• Secure authentication</Text>
              <Text>• Real-time updates</Text>
              <Text>• Media sharing</Text>
            </View>

            <View className="space-y-2">
              <Text className="text-xl font-bold">Contact:</Text>
              <Text>Website: mycommunity.app</Text>
              <Text>Email: support@mycommunity.app</Text>
              <Text>Discord: discord.gg/mycommunity</Text>
            </View>

            <View className="space-y-2">
              <Text className="text-xl font-bold">Version:</Text>
              <Text>1.0.0</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}