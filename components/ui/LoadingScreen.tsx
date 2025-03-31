import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { getLoadingEffect } from "./loading-effects";

export function LoadingScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const foregroundColor = isDarkColorScheme ? "#ffffff" : "#000000";
  const BackgroundEffect = getLoadingEffect("matrix").component;

  return (
    <View className="absolute inset-0 w-full h-full bg-background">
      <BackgroundEffect />
      {/* <View className="absolute inset-0 items-center justify-center">
        <ActivityIndicator size="large" color={"green"} />
      </View> */}
    </View>
  );
}
