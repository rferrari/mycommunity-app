import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "../ui/button";

const handleWaitingList = () => {
  router.push("/(onboarding)/home");
};

export function ProfileSpectatorInfo() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <View className="w-full py-6 bg-foreground/5 rounded-xl">
        <View className="items-center flex flex-col px-4">
          <Ionicons
            name="rocket-outline"
            size={48}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
            className="mb-4"
          />
          <Text className="text-xl font-bold text-center">
            Ready to Start Your Journey?
          </Text>
          <Text className="text-center opacity-70">
            Join our community and start earning rewards for your content
          </Text>
          <Button onPress={handleWaitingList} className="bg-foreground w-full mt-4">
            <Text className="text-background text-lg font-bold">
              Find out how to Join SkateHive
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
}
