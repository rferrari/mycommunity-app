import React from "react";
import { ScrollView } from "react-native";
import { Leaderboard } from "~/components/Leaderboard/leaderboard";
import { useAuth } from "~/lib/auth-provider";

export default function LeaderboardScreen() {
  const { username } = useAuth();

  return (
    <ScrollView
      className="flex-1 bg-background p-2 w-full"
      showsVerticalScrollIndicator={false}
    >
      <Leaderboard currentUsername={username} />
    </ScrollView>
  );
}
