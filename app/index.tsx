import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth-provider";

const BackgroundVideo = () => {
  const player = useVideoPlayer(
    require("../assets/videos/background.mp4"),
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  return (
    <View className="absolute inset-0">
      <VideoView
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        player={player}
      />
      <View className="absolute inset-0 bg-black/20" />
    </View>
  );
};

export default function Index() {
  const colorScheme = useColorScheme();
  const isDarkColorScheme = colorScheme === "dark";
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/(tabs)/feed");
    }
  }, [isAuthenticated]);

  const handlePress = () => {
    router.push("/login");
  };

  const handleInfoPress = () => {
    router.push("/about");
  };

  if (isLoading || isAuthenticated) {
    return (
      <View className="flex-1 bg-background">
        <BackgroundVideo />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <BackgroundVideo />
      <Pressable
        onPress={handleInfoPress}
        className="absolute top-12 right-6 z-10"
      >
        <View className="bg-foreground/20 rounded-full p-2">
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
          />
        </View>
      </Pressable>

      <View className="flex-1 items-center justify-end pb-8 px-4">
        <Button
          className="font-bold w-full border bg-black/90 border-lime-400 transition-all duration-[20ms] active:scale-[0.975]"
          size="xl"
          onPress={handlePress}
          haptic="success"
        >
          <Text className="text-lime-400">Let's go!</Text>
        </Button>
        <Text className="text-sm text-foreground/50 mt-2">Alpha</Text>
      </View>
    </View>
  );
}
