import React, { Suspense } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Leaderboard } from "~/components/Leaderboard/leaderboard";
import { LoadingScreen } from "~/components/ui/LoadingScreen";
import { useAuth } from "~/lib/auth-provider";

export default function LeaderboardScreen() {
  const { username } = useAuth();

  return (
    <ScrollView
      className="flex-1 bg-background min-h-[100dvh] p-2 w-full"
      showsVerticalScrollIndicator={false}
    >
      <Leaderboard currentUsername={username} />
    </ScrollView>
  );
}
