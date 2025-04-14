import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "~/lib/auth-provider";
import { getBalance, getRewards } from "~/lib/api";
import { LoadingScreen } from "~/components/ui/LoadingScreen";
import { RewardsSpectatorInfo } from "~/components/SpectatorMode/RewardsSpectatorInfo";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { useMarket } from "~/lib/hooks/useQueries";

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
  const { data: marketData } = useMarket();

  useEffect(() => {
    const fetchBalancetData = async () => {
      if (!username || username === "SPECTATOR") {
        setIsLoading(false);
        return;
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

  const calculateTotalValue = () => {
    if (!balanceData || !rewardsData || !marketData) return "0.00";

    // HBD is 1:1 with USD
    const hbdValue = parseFloat(balanceData.hbd) || 0;

    // Convert HIVE to USD using market price
    const hivePrice = parseFloat(marketData.close) || 0;
    const hiveValue = (parseFloat(balanceData.hive) || 0) * hivePrice;
    const hpValue = (parseFloat(balanceData.hp_equivalent) || 0) * hivePrice;

    // Pending rewards in HBD
    const pendingValue =
      parseFloat(rewardsData.summary.total_pending_payout) || 0;

    return `$`+(hiveValue + hbdValue + hpValue + pendingValue).toFixed(2);
  };

  const hideValue = (value: string | number | undefined) => {
    return !showWallet ? "•••" : value?.toString() || "0";
  };

  const sortedPendingPosts = (posts: RewardsData["pending_posts"]) => {
    return [...posts].sort((a, b) => {
      const aTimeLeft =
        a.remaining_till_cashout.days * 24 * 60 +
        a.remaining_till_cashout.hours * 60 +
        a.remaining_till_cashout.minutes;
      const bTimeLeft =
        b.remaining_till_cashout.days * 24 * 60 +
        b.remaining_till_cashout.hours * 60 +
        b.remaining_till_cashout.minutes;
      return aTimeLeft - bTimeLeft;
    });
  };

  const formatTimeLeft = (time: {
    days: number;
    hours: number;
    minutes: number;
  }) => {
    const parts = [];
    if (time.days || time.days === 0) parts.push(`${time.days}d`);
    if (time.hours || time.hours === 0) parts.push(`${time.hours}h`);
    if (time.minutes || time.minutes === 0) parts.push(`${time.minutes}m`);
    return parts.join(" ") || "0m";
  };

  const calculateDollarValue = (
    amount: string | undefined,
    price: string | undefined
  ) => {
    if (!amount || !price) return "$0.00";
    return `$`+(parseFloat(amount) * parseFloat(price)).toFixed(2);
  };

  return (
    <ScrollView className="flex-1 p-4 bg-background">
      {username === "SPECTATOR" ? (
        <RewardsSpectatorInfo />
      ) : (
        <View className="flex flex-col gap-4">
          <View className="items-center mt-2 mb-4">
            <View
              className="w-24 h-24 rounded-full bg-foreground/10 items-center justify-center"
              style={{
                borderWidth: 3,
                borderColor: isDarkColorScheme ? "#ffffff20" : "#00000020",
              }}
            >
              <Ionicons
                name="trophy-outline"
                size={48}
                color={isDarkColorScheme ? "#34C759" : "#34C759"}
              />
            </View>
            <Text className="text-3xl font-bold mt-2">Rewards</Text>
          </View>

          {/* Account Overview Card */}
          <Card>
            <CardHeader className="flex-row justify-between items-center">
              <CardTitle>Account Overview</CardTitle>
              <Pressable onPress={() => setShowWallet(!showWallet)}>
                <Ionicons
                  name={showWallet ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={isDarkColorScheme ? "#ffffff" : "#000000"}
                />
              </Pressable>
            </CardHeader>
            <CardContent>
              <View className="flex flex-col gap-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-muted-foreground">Total Value</Text>
                  <Text className="text-xl font-bold">
                    {hideValue(calculateTotalValue())}
                  </Text>
                </View>

                <View className="flex flex-col gap-1 pt-2">
                  <View className="flex flex-col gap-1">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-muted-foreground">HBD</Text>
                      <View className="items-end">
                        <Text className="font-medium">
                          {hideValue(balanceData?.hbd)}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {hideValue(
                            calculateDollarValue(
                              balanceData?.hbd,
                              "1"
                            )
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex flex-col gap-1">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-muted-foreground">HIVE</Text>
                      <View className="items-end">
                        <Text className="font-medium">
                          {hideValue(balanceData?.hive)}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {hideValue(
                            calculateDollarValue(
                              balanceData?.hive,
                              marketData?.close
                            )
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex flex-col gap-1">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-muted-foreground">Hive Power</Text>
                      <View className="items-end">
                        <Text className="font-medium">
                          {hideValue(balanceData?.hp_equivalent)}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {hideValue(
                            calculateDollarValue(
                              balanceData?.hp_equivalent,
                              marketData?.close
                            )
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Pending Rewards Card */}
          {rewardsData && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <View className="flex flex-col gap-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-muted-foreground">Total Pending</Text>
                    <Text className="text-xl font-bold text-green-500">
                      {hideValue(rewardsData.summary.total_pending_payout)} HBD
                    </Text>
                  </View>

                  <View className="flex flex-col gap-1 border-t border-border pt-3">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-muted-foreground">
                        Active Posts
                      </Text>
                      <Text className="font-medium">
                        {hideValue(rewardsData.summary.pending_posts_count)}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <Text className="text-muted-foreground">
                        Author Rewards
                      </Text>
                      <Text className="font-medium">
                        {hideValue(rewardsData.summary.total_author_rewards)}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <Text className="text-muted-foreground">
                        Curator Rewards
                      </Text>
                      <Text className="font-medium">
                        {hideValue(rewardsData.summary.total_curator_payouts)}
                      </Text>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          )}

          {/* Active Posts Card */}
          {rewardsData &&
            rewardsData.pending_posts &&
            rewardsData.pending_posts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <View className="flex flex-col gap-4">
                    {sortedPendingPosts(rewardsData.pending_posts).map(
                      (post, index) => (
                        <View
                          key={index}
                          className="pb-3 border-b border-border last:border-0"
                        >
                          <View className="flex flex-col gap-1">
                            <Text className="font-medium">
                              {post.title || "Comment"}
                            </Text>
                            <View className="flex-row justify-between items-center">
                              <Text className="text-muted-foreground">
                                Potential
                              </Text>
                              <Text className="font-medium text-green-500">
                                {hideValue(post.pending_payout_value)} HBD
                              </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                              <Text className="text-muted-foreground">
                                Time Left
                              </Text>
                              <Text className="text-sm">
                                {formatTimeLeft(post.remaining_till_cashout)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                </CardContent>
              </Card>
            )}
        </View>
      )}
    </ScrollView>
  );
}
