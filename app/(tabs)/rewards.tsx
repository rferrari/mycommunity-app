import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { Leaderboard } from "~/components/Leaderboard/leaderboard";
import { useColorScheme } from "~/lib/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "~/lib/auth-provider";
import { getBalance, getRewards } from "~/lib/api";
import { LoadingScreen } from "~/components/ui/LoadingScreen";
import { RewardsSpectatorInfo } from "~/components/SpectatorMode/RewardsSpectatorInfo";

interface BalancetData {
  account_name: string;
  hive: string;
  hbd: string;
  vests: string;
  hp_equivalent: string;
  hive_savings: string;
  hbd_savings: string;
}

interface RewardsData {
  summary: {
    total_pending_payout: string;
    pending_hbd: string;
    pending_hp: string;
    pending_posts_count: string;
    total_author_rewards: string;
    total_curator_payouts: string;
  };
  pending_posts: {
    title: string;
    permlink: string;
    created: string;
    cashout_time: string;
    remaining_till_cashout: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
      milliseconds: number;
    };
    last_payout: string;
    pending_payout_value: string;
    author_rewards: string;
    author_rewards_in_hive: string;
    total_payout_value: string;
    curator_payout_value: string;
    beneficiary_payout_value: string;
    total_rshares: string;
    net_rshares: string;
    total_vote_weight: string;
    beneficiaries: string;
    max_accepted_payout: string;
    percent_hbd: number;
    allow_votes: boolean;
    allow_curation_rewards: boolean;
  }[];
}

export default function WalletScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const { username } = useAuth();
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [balanceData, setBalancetData] = useState<BalancetData | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalancetData = async () => {
      if (!username || username === "SPECTATOR") {
        setIsLoading(false);
        return
      }

      try {
        setIsLoading(true);
        const [rewardsData, balanceData] = await Promise.all([
          getRewards(username),
          getBalance(username),
        ]);

        if (rewardsData) {
          setRewardsData(rewardsData);
        }
        if (balanceData) {
          setBalancetData(balanceData);
        }
      } catch (error) {
        console.error("Error fetching balance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalancetData();
  }, [username]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-2 space-y-4">

          {/* Rewards Info Section */}
          <View className="w-full">
            {rewardsData && (
              <View className="w-full py-4">
                <View className="items-center">
                  <View
                    className="w-24 h-24 rounded-full bg-foreground/10 items-center justify-center"
                    style={{
                      borderWidth: 3,
                      borderColor: isDarkColorScheme
                        ? "#ffffff20"
                        : "#00000020",
                    }}
                  >
                    <Ionicons
                      name="trophy-outline"
                      size={48}
                      color={isDarkColorScheme ? "#34C759" : "#34C759"}
                    />

                  </View>
                  <Text className="text-xl font-bold mt-2">Incoming Rewards</Text>
                </View>

                {/* SPECTATOR */}
                {username === 'SPECTATOR' && (
                  <RewardsSpectatorInfo />
                )}

                {/* Estimate Total Account Value */}
                {username !== 'SPECTATOR' && (
                  < View className="w-full py-6 bg-foreground/5 rounded-xl">
                    <View className="flex-row items-center justify-between px-6">
                      <View className="flex-row items-center">
                        <Text className="text-xl font-bold">Estimated Account Value</Text>
                      </View>
                      <Pressable onPress={() => setShowWallet(!showWallet)}>
                        <Ionicons
                          name={showWallet ? "eye-outline" : "eye-off-outline"}
                          size={24}
                          color={isDarkColorScheme ? "#ffffff" : "#000000"}
                        />
                      </Pressable>
                    </View>

                    <View className="px-6 mt-4 space-y-3">
                      <View className="flex-row justify-between">
                        <Text className="text-lg opacity-70">$</Text>
                        <Text className="text-lg font-medium">
                          "$$.$$$"
                        </Text>
                      </View>
                    </View>
                  </View>
                )}



                {/* Wallet Section */}
                {username !== 'SPECTATOR' && (
                  <View className="w-full py-6 bg-foreground/5 rounded-xl">
                    <View className="flex-row items-center justify-between px-6">
                      <View className="flex-row items-center">
                        <Text className="text-xl font-bold">Balance</Text>
                      </View>
                      <Pressable onPress={() => setShowWallet(!showWallet)}>
                        <Ionicons
                          name={showWallet ? "eye-outline" : "eye-off-outline"}
                          size={24}
                          color={isDarkColorScheme ? "#ffffff" : "#000000"}
                        />
                      </Pressable>
                    </View>
                    {balanceData && (
                      <View className="px-6 mt-4 space-y-3">
                        <View className="flex-row justify-between">
                          <Text className="text-lg opacity-70">Hive Power:</Text>
                          <Text className="text-lg font-medium">
                            {!showWallet ? (
                              "$$.$$$"
                            ) : (
                              balanceData.hp_equivalent
                            )}
                          </Text>
                        </View>

                        <View className="flex-row justify-between">
                          <Text className="text-lg opacity-70">HIVE:</Text>
                          <Text className="text-lg font-medium">
                            {!showWallet ? (
                              "$$.$$$"
                            ) : (
                              balanceData.hive
                            )}
                          </Text>
                        </View>

                        <View className="flex-row justify-between">
                          <Text className="text-lg opacity-70">HBD:</Text>
                          <Text className="text-lg font-medium">
                            {!showWallet ? (
                              "$$.$$$"
                            ) : (
                              balanceData.hbd
                            )}
                          </Text>
                        </View>
                        <View className="flex-row justify-between">
                          <Text className="text-lg opacity-70">Savings:</Text>
                          <View className="items-end">
                            <Text className="text-lg font-medium">
                              {!showWallet ? (
                                "$$.$$$"
                              ) : (
                                balanceData.hive_savings + " HIVE"
                              )}
                            </Text>
                            <Text className="text-lg font-medium">
                              {!showWallet ? (
                                "$$.$$$"
                              ) : (
                                balanceData.hbd_savings + " HBD"
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {/* Pending Rewards */}
                {username !== 'SPECTATOR' && (
                  <View className="px-6 mt-4">
                    <View className="space-y-3">
                      <View className="flex-row justify-between">
                        <Text className="text-lg opacity-70">
                          Payout:
                        </Text>
                        <Text className="text-lg font-medium">
                          {rewardsData.summary.total_pending_payout} HBD
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-lg opacity-70">
                          Posts:
                        </Text>
                        <Text className="text-lg font-medium">
                          {rewardsData.summary.pending_posts_count}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-lg opacity-70">
                          Author Rewards:
                        </Text>
                        <Text className="text-lg font-medium">
                          {rewardsData.summary.total_author_rewards}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-lg opacity-70">
                          Curator Rewards:
                        </Text>
                        <Text className="text-lg font-medium">
                          {rewardsData.summary.total_curator_payouts}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {username !== 'SPECTATOR' && (
                  <View className="px-6 mt-4">
                    <View className="space-y-3">
                      <View className="flex-row justify-between">
                        <Text className="text-lg opacity-70">
                          Pending Rewards: 
                        </Text>
                      </View>
                      {rewardsData.pending_posts.map((post, index) => (
                        <View key={index} className="flex-row justify-between">
                          <Text className="text-lg opacity-70">
                            {post.title || "Comment"}
                          </Text>
                          <View className="flex-row space-x-2">
                            <Text className="text-lg opacity-70">
                              {/* Payout: */}
                            </Text>
                            <Text className="text-lg font-medium">
                              {post.pending_payout_value}
                            </Text>
                          </View>
                          <View className="flex-row space-x-2">
                            <Text className="text-lg opacity-70">
                              Payment in:&nbsp;
                            </Text>
                            <Text className="text-lg font-medium">
                              {post.remaining_till_cashout.days || "0"}D{" "}
                              {post.remaining_till_cashout.hours || "0"}h{" "}
                              {post.remaining_till_cashout.minutes || "0"}m{" "}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

              </View>
            )}


          </View>
        </View>
      </ScrollView >
    </SafeAreaView >
  );
}
