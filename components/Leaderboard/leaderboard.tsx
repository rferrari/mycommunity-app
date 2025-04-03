import React, { useMemo } from "react";
import { View, Image, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "~/lib/useColorScheme";
import { Crown } from "lucide-react-native";
import { LoadingScreen } from "../ui/LoadingScreen";
import { useLeaderboard } from "~/lib/hooks/useQueries";

interface LeaderboardProps {
  currentUsername: string | null;
}

interface LeaderboardUserInfo {
  position: number;
  id: number;
  hive_author: string;
  points: number;
}

export function Leaderboard({ currentUsername }: LeaderboardProps) {
  const { isDarkColorScheme } = useColorScheme();
  const { data: leaderboardData, isLoading, error } = useLeaderboard();

  const { topSkaters, surroundingUsers, currentUserInfo } = useMemo(() => {
    if (!leaderboardData) return { topSkaters: [], surroundingUsers: [], currentUserInfo: null };

    const top10 = leaderboardData.slice(0, 10).map((user, index) => ({
      position: index + 1,
      id: user.id,
      hive_author: user.hive_author,
      points: user.points,
    }));

    let surroundingUsers: LeaderboardUserInfo[] = [];
    let currentUserInfo = null;

    if (currentUsername) {
      const userIndex = leaderboardData.findIndex(user => user.hive_author === currentUsername);

      if (userIndex !== -1) {
        currentUserInfo = {
          position: userIndex + 1,
          id: leaderboardData[userIndex].id,
          hive_author: leaderboardData[userIndex].hive_author,
          points: leaderboardData[userIndex].points,
        };

        if (userIndex > 9) {
          const startIndex = userIndex > 14 ? userIndex - 5 : 10;
          const endIndex = Math.min(userIndex + 5, leaderboardData.length - 1);

          surroundingUsers = leaderboardData.slice(startIndex, endIndex + 1)
            .map((user, idx) => ({
              position: startIndex + idx + 1,
              id: user.id,
              hive_author: user.hive_author,
              points: user.points,
            }))
            .filter(user => user.hive_author !== currentUsername); // Removendo duplicata do usuário atual

          surroundingUsers = [...surroundingUsers, currentUserInfo].sort((a, b) => a.position - b.position);
        }
      }
    }

    return { topSkaters: top10, surroundingUsers, currentUserInfo };
  }, [leaderboardData, currentUsername]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <View className="flex-1 justify-center items-center"><Text>Error loading leaderboard</Text></View>;

  return (
    <ScrollView className="w-full py-4" showsVerticalScrollIndicator={false}>
      <View className="items-center mb-4">
        <View
          className="w-24 h-24 rounded-full bg-foreground/10 items-center justify-center"
          style={{ borderWidth: 3, borderColor: isDarkColorScheme ? "#ffffff20" : "#00000020" }}
        >
          <Ionicons name="podium-outline" size={48} color="#34C759" />
        </View>
        <Text className="text-3xl font-bold mt-2">Leaderboard</Text>
      </View>

      <View>
        {topSkaters.map((skater, index) => (
          <LeaderboardItem key={skater.id} skater={skater} isTop={index < 3} isCurrentUser={skater.hive_author === currentUsername} />
        ))}

        {currentUserInfo && surroundingUsers.length > 0 && (
          <>
            <View className="w-full my-2 bg-gray-600 h-1 opacity-50" />
            {surroundingUsers.map(skater => (
              <LeaderboardItem key={skater.id} skater={skater} isCurrentUser={skater.hive_author === currentUsername} />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const LeaderboardItem = ({ skater, isTop = false, isCurrentUser = false }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      marginVertical: 4,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      borderRadius: isTop ? 10 : 0,
      backgroundColor: isCurrentUser ? "#444" : "transparent",
      borderWidth: isCurrentUser ? 2 : 0,
      borderColor: isCurrentUser ? "#FFD700" : "transparent",
    }}
  >
    <Text style={{ fontSize: 16, fontWeight: "bold", color: isTop ? "#d4af37" : "#eee", width: 50, textAlign: "center" }}>
      #{skater.position}
    </Text>

    <View className="h-12 w-12 mr-3 rounded-full relative">
      <Image
        source={{ uri: `https://images.hive.blog/u/${skater.hive_author}/avatar/small` }}
        style={{ width: 40, height: 40, borderRadius: 50, borderWidth: 3 }}
      />
      {isTop && skater.position === 1 && (
        <View className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Crown size={18} color="#FFCC00" strokeWidth={2} />
        </View>
      )}
    </View>

    <Text style={{ fontSize: 16, paddingLeft: 10, fontWeight: "bold", flex: 1, textAlign: "left", color: isTop ? "#fff" : "#eee" }}>
      {skater.hive_author}
    </Text>
    <Text style={{ fontSize: 16, fontWeight: "bold", color: isTop ? "#4caf50" : "#fff" }}>
      {skater.points.toFixed(0)}
    </Text>
  </View>
);
