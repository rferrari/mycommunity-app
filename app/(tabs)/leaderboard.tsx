import React from "react";
import { View } from "react-native";
import { Leaderboard } from "~/components/Leaderboard/leaderboard";
import { useAuth } from "~/lib/auth-provider";

export default function LeaderboardScreen() {
  const { username } = useAuth();

  return (
    <View
      className="flex-1 bg-background p-2 w-full h-full"
    >
      <Leaderboard currentUsername={username} />
    </View>
  );
}
