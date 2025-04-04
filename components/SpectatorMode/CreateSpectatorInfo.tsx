import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "../ui/button";

const handleNavigate = () => {
  router.push("/(tabs)/rewards");
};

export function CreateSpectatorInfo() {
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
        <Text className="text-3xl font-bold mt-2">Creator & Influencer Hub</Text>
        <Text className="text-center opacity-70 mt-2">
          Monetize your content, grow your audience, and collaborate with brands!
        </Text>
      </View>

      {[
        {
          icon: "cash-outline",
          title: "Monetization",
          text: "Earn from posts, videos, and exclusive content. The more you engage, the more you earn!",
        },
        {
          icon: "cash-outline",
          title: "Grow Your Audience",
          text: "Boost your visibility through trending topics, engagement strategies, and creator challenges.",
        },
        {
          icon: "cash-outline",
          title: "Brand Collaborations",
          text: "Partner with top brands and get exclusive sponsorship opportunities for your content.",
        },
        {
          icon: "cash-outline",
          title: "Exclusive Creator Perks",
          text: "Unlock early access to new features, special promotions, and premium creator tools.",
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
