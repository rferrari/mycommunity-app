import React, { useState, useEffect } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";
import { API_BASE_URL } from "~/lib/constants";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "~/lib/useColorScheme";
import { Crown } from "lucide-react-native";
import { LoadingScreen } from "../ui/LoadingScreen";

interface LeaderboardProps {
  currentUsername: string | null;
}

interface LeaderboardData {
  id: number;
  hive_author: string;
  hive_balance: number;
  hp_balance: number;
  hbd_balance: number;
  hbd_savings_balance: number;
  has_voted_in_witness: boolean;
  eth_address: string;
  gnars_balance: number;
  gnars_votes: number;
  skatehive_nft_balance: number;
  max_voting_power_usd: number;
  last_updated: string;
  last_post: string;
  post_count: number;
  points: number;
  giveth_donations_usd: number;
  giveth_donations_amount: number;
}

export function Leaderboard({ currentUsername }: LeaderboardProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [skaters, setSkaters] = useState<LeaderboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserPosition, setCurrentUserPosition] = useState<string>("0");
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserScore, setCurrentUserScore] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkaters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`);
        const data = await response.json();
        const sortedData = data.sort(
          (a: LeaderboardData, b: LeaderboardData) => b.points - a.points
        );

        // Show top 10 results
        const top10Results = sortedData.slice(0, 10);

        // Find the current user's position in the leaderboard
        const currentUserIndex = sortedData.findIndex(
          (user: LeaderboardData) => user.hive_author === currentUsername
        );

        // Add the current user's position to the top 10 results at the 11th position
        if (currentUserIndex > 10) {
          // top10Results.push(sortedData[currentUserIndex]);
          setCurrentUserPosition(currentUserIndex + 1); // Add 1 because indices are 0-based
          setCurrentUserName(currentUsername);
          setCurrentUserScore(sortedData[currentUserIndex + 1].points);
        }

        setSkaters(top10Results);
        setIsLoading(false);
      } catch (error) {
        setError("Error fetching skatehive api data");
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchSkaters();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
      <View className="w-full py-4">
        <View className="items-center">
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
              color={isDarkColorScheme ? "#FFD700" : "#DAA520"}
            />
          </View>
          <Text className="text-xl font-bold mt-2">Leaderboard</Text>
        </View>

        <View>
          {/* Heading */}
          {/* <View key={'skater'} className='' style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                  }}>
                      <Text style={{ fontWeight: 'bold' }}>Skater</Text>
                      <Text style={{ fontWeight: 'bold' }}>Score</Text>
                  </View> */}

                {/* Content */}
                {skaters.map((skater, index) => {
                    const isTopThree = index < 3;
                    const isTopOne = index < 1;
                    return (
                        <View
                            key={skater.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: isTopThree ? 10 : 10,
                                marginVertical: isTopThree ? 4 : 4,
                                borderBottomWidth: 1,
                                borderBottomColor: '#ccc',
                                borderRadius: isTopThree ? 10 : 0,
                            }}>


                            <Text style={{
                                fontSize: isTopThree ? 16 : 16,
                                fontWeight: 'bold',
                                color: isTopThree ? '#34C759' : '#eee',
                                width: 50,
                                textAlign: 'center',
                            }}>
                                #{index + 1}
                            </Text>
          {/* Content */}
          {skaters.map((skater, index) => {
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
                                    source={{ uri: `https://images.hive.blog/u/${skater.hive_author}/avatar/small` }}
                                    style={{
                                        width: isTopThree ? 40 : 40,
                                        height: isTopThree ? 40 : 40,
                                        borderRadius: 50,
                                        borderWidth: 3,
                                    }}
                                    alt={`${skater.hive_author}'s avatar`}
                                />
                                {/* Crown positioned absolutely on top of the avatar */}
                                {isTopOne && (
                                    <View className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Crown size={18} color="#34C759" strokeWidth={2} />
                                    </View>
                                )}
                            </View>
                <View className="h-12 w-12 mr-3 rounded-full relative">
                  <Image
                    source={{
                      uri: `https://images.hive.blog/u/${skater.hive_author}/avatar/small`,
                    }}
                    // className="w-full h-full border-2 border-[#FFCC00] rounded-full"
                    style={{
                      width: isTopThree ? 40 : 40,
                      height: isTopThree ? 40 : 40,
                      borderRadius: 50,
                      borderWidth: 3,
                      // borderColor: isTopOne ? '#FFCC00' : '#ccc',
                    }}
                    alt={`${skater.hive_author}'s avatar`}
                  />
                  {/* Crown positioned absolutely on top of the avatar */}
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

          {/* Current logged in user position */}
          {currentUserName && (
            <View
              key={currentUserPosition}
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
                #{currentUserPosition}
              </Text>

              <View className="h-12 w-12 mr-3 rounded-full relative">
                <Image
                  source={{
                    uri: `https://images.hive.blog/u/${currentUserName}/avatar/small`,
                  }}
                  // className="w-full h-full border-2 border-[#FFCC00] rounded-full"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    borderWidth: 3,
                    // borderColor: isTopOne ? '#FFCC00' : '#ccc',
                  }}
                  alt={`${currentUserName}'s avatar`}
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
                {currentUserName}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {/* {currentUserScore?.toFixed(0)} */}
                {currentUserScore}
              </Text>
            </View>
          )}
        </View>
    </View>
  );
}
