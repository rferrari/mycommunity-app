import React from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { getLoadingEffect } from "./loading-effects";

export function LoadingScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const foregroundColor = isDarkColorScheme ? "#ffffff" : "#000000";
  const BackgroundEffect = getLoadingEffect("videobg").component;

  return (
    <View className="bg-background">
      <BackgroundEffect />
      <View className="w-full h-full items-center justify-center">
        <ActivityIndicator size="large" color={foregroundColor} />
      </View>
    </View>
  );
}
