import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "../ui/button";
import { VideoPlayer } from '~/components/Feed/VideoPlayer';
import Icon from 'react-native-vector-icons/FontAwesome';

const handleWaitingList = () => {
  router.push("/(onboarding)/home");
};

export function ProfileSpectatorInfo() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <View className="items-center mt-2 mb-4">
        <View className="w-full my-2 bg-gray-600 h-1 opacity-50" />
        <View className="space-y-4 mt-6">

          <Text className="text-4xl font-bold text-center">
            Join SkateHive
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
            <Icon name="github" size={40} color="#333" />
          </View>
        </View>
      </View>
    </>
  );
}
