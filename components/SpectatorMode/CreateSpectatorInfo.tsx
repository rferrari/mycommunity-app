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
          <Ionicons name="skull-outline" size={48} color="#34C759" />
        </View>
        <Text className="text-3xl font-bold mt-2 uppercase">F*ck Web2.</Text>
        <Text className="text-center opacity-70 mt-2">
        Own Your Content. No ads. No overlords. Just you, your content, and your rewards.
        </Text>
      </View>

      {[
        {
          icon: "flash-outline",
          title: "💰 GET PAID. FOR REAL.",
          text: "No shadowbans. No demonetization. Get paid for every post, comment, and share.",
        },
        {
          icon: "flame-outline",
          title: "🚀 BUILD YOUR CREW.",
          text: "Your followers? They actually see your content. Grow without begging algorithms.",
        },
        {
          icon: "eye-off-outline",
          title: "🛑 NO CENSORSHIP. NO BS.",
          text: "Say what you want. Create what you want. No suits deciding what’s 'allowed'.",
        },
        {
          icon: "hammer-outline",
          title: "🖕 BE YOUR OWN PLATFORM.",
          text: "Web3 means you own your content. No bans. No takedowns. No begging for ad revenue.",
        },
      ].map((item, index) => (
        <View key={index} className="w-full mt-4 p-6 bg-foreground/5 rounded-xl">
          <View className="items-center flex flex-col px-4">
            {/* <Ionicons name={item.icon} size={24} color="#FF9500" /> */}
            <Text className="font-bold mt-2 uppercase">{item.title}</Text>
          </View>
          <View>
            <Text className="text-muted-foreground">{item.text}</Text>
          </View>
        </View>
      ))}

      <View className="items-center mt-6">
        <Button onPress={handleNavigate} className="bg-foreground w-full">
          <Text className="text-background text-lg font-bold">Join the Revolution</Text>
        </Button>
      </View>
    </>
  );
}
