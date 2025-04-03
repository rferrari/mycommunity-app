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

  const { topSkaters, currentUserInfo } = useMemo((): {
    topSkaters: LeaderboardUserInfo[];
    currentUserInfo: LeaderboardUserInfo | null;
  } => {
    if (!leaderboardData) return { topSkaters: [], currentUserInfo: null };

    const top10 = leaderboardData.slice(0, 10).map((user, index) => ({
      position: index + 1,
      id: user.id,
      hive_author: user.hive_author,
      points: user.points
    }));
    
    let userInfo: LeaderboardUserInfo | null = null;
    if (currentUsername) {
      const userIndex = leaderboardData.findIndex(
        user => user.hive_author === currentUsername
      );
      if (userIndex > 10) {
        userInfo = {
          position: userIndex + 1,
          id: leaderboardData[userIndex].id,
          hive_author: leaderboardData[userIndex].hive_author,
          points: leaderboardData[userIndex].points
        };
      }
    }

    return { 
      topSkaters: top10,
      currentUserInfo: userInfo 
    };
  }, [leaderboardData, currentUsername]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>An error occurred while loading the leaderboard</Text>
      </View>
    );
  }

  return (
    <ScrollView className="w-full py-4" showsVerticalScrollIndicator={false}>
      <View className="items-center mb-4">
        <View
          className="w-24 h-24 rounded-full bg-foreground/10 items-center justify-center"
          style={{
            borderWidth: 3,
            borderColor: isDarkColorScheme ? "#ffffff20" : "#00000020",
          }}
        >
          <Ionicons
            name="podium-outline"
            size={48}
            color={isDarkColorScheme ? "#34C759" : "#34C759"}
          />
        </View>
        <Text className="text-3xl font-bold mt-2">Leaderboard</Text>
      </View>

      <View>
        {topSkaters.map((skater, index) => {
          const isTopThree = index < 3;
          const isTopOne = index < 1;
          return (
            <View
              key={skater.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isTopThree ? 10 : 10,
                marginVertical: isTopThree ? 4 : 4,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                borderRadius: isTopThree ? 10 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: isTopThree ? 16 : 16,
                  fontWeight: "bold",
                  color: isTopThree ? "#d4af37" : "#eee",
                  width: 50,
                  textAlign: "center",
                }}
              >
                #{index + 1}
              </Text>

              <View className="h-12 w-12 mr-3 rounded-full relative">
                <Image
                  source={{
                    uri: `https://images.hive.blog/u/${skater.hive_author}/avatar/small`,
                  }}
                  style={{
                    width: isTopThree ? 40 : 40,
                    height: isTopThree ? 40 : 40,
                    borderRadius: 50,
                    borderWidth: 3,
                  }}
                  alt={`${skater.hive_author}'s avatar`}
                />
                {isTopOne && (
                  <View className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Crown size={18} color="#FFCC00" strokeWidth={2} />
                  </View>
                )}
              </View>

              <Text
                style={{
                  fontSize: isTopThree ? 18 : 16,
                  paddingLeft: 10,
                  fontWeight: "bold",
                  flex: 1,
                  textAlign: "left",
                  color: isTopThree ? "#fff" : "#eee",
                }}
              >
                {skater.hive_author}
              </Text>
              <Text
                style={{
                  fontSize: isTopThree ? 18 : 16,
                  fontWeight: "bold",
                  color: isTopThree ? "#4caf50" : "#fff",
                }}
              >
                {skater.points.toFixed(0)}
              </Text>
            </View>
          );
        })}

        {currentUserInfo && (
          <View
            key={currentUserInfo.position}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              marginVertical: 4,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              borderRadius: 0,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#eee",
                width: 50,
                textAlign: "center",
              }}
            >
              #{currentUserInfo.position}
            </Text>

            <View className="h-12 w-12 mr-3 rounded-full relative">
              <Image
                source={{
                  uri: `https://images.hive.blog/u/${currentUserInfo.hive_author}/avatar/small`,
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  borderWidth: 3,
                }}
                alt={`${currentUserInfo.hive_author}'s avatar`}
              />
            </View>

            <Text
              style={{
                fontSize: 16,
                paddingLeft: 10,
                fontWeight: "bold",
                flex: 1,
                textAlign: "left",
                color: "#eee",
              }}
            >
              {currentUserInfo.hive_author}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {currentUserInfo.points.toFixed(0)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
