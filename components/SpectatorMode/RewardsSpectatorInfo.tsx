import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "../ui/button";

const handleNavigate = () => {
  router.push("/(tabs)/profile");
};

export function RewardsSpectatorInfo() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <View className="items-center mt-2 mb-4">
        <View
          className="w-24 h-24 rounded-full bg-foreground/10 items-center justify-center"
          style={{ borderWidth: 3, borderColor: isDarkColorScheme ? "#ffffff20" : "#00000020" }}
        >
          <Ionicons name="megaphone-outline" size={48} color="#34C759" />
        </View>
        <Text className="text-3xl font-bold mt-2">Rewards</Text>
        <Text className="text-center opacity-70 mt-2">
        Learn how you can earn rewards in the SkateHive community!
        </Text>
      </View>

      {[
        {
          icon: "cash-outline",
          title: "Curation Rewards",
          text: "Earn rewards by upvoting and engaging with content. The more you curate, the more you earn!",
        },
        {
          icon: "cash-outline",
          title: "Comment Rewards",
          text: "Get rewarded for interacting with posts. Valuable comments can earn upvotes too!",
        },
        {
          icon: "cash-outline",
          title: "Magazine Rewards",
          text: "Participate in SkateHive's Magazine and earn extra incentives for your contributions.",
        },
        {
          icon: "cash-outline",
          title: "More Ways to Earn",
          text: "Through contests, engagement, and consistent contributions, you can unlock even morer.",
        },
      ].map((item, index) => (
        <View key={index} className="w-full mt-4 p-6 bg-foreground/5 rounded-xl">
          <View className="items-center flex flex-col px-4">
            {/* <Ionicons name={item.icon} size={24} color="#34C759" /> */}
            <Text className="font-semibold mt-2">{item.title}</Text>
          </View>
          <View>
            <Text className="text-muted-foreground">{item.text}</Text>
          </View>
        </View>
      ))}

      <View className="items-center mt-6">
        <Button onPress={handleNavigate} className="bg-foreground w-full">
          <Text className="text-background text-lg font-bold">Got it!</Text>
        </Button>
      </View>
    </>
  );
}
