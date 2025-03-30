import React, { Suspense } from "react";
import { View } from "react-native";
import { Leaderboard } from "~/components/Leaderboard/leaderboard";
import { LoadingScreen } from "~/components/ui/LoadingScreen";
import { useAuth } from "~/lib/auth-provider";

export default function LeaderboardScreen() {
  const { username } = useAuth();

  return (
    <View className="flex-1 bg-background">
      <Suspense fallback={<LoadingScreen />}>
        <Leaderboard currentUsername={username} />
      </Suspense>
    </View>
  );
}
