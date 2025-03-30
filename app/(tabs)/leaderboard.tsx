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

// interface BalancetData {
//   account_name: string;
//   hive: string;
//   hbd: string;
//   vests: string;
//   hp_equivalent: string;
//   hive_savings: string;
//   hbd_savings: string;
// }

// interface RewardsData {
//   summary: {
//     total_pending_payout: string;
//     pending_hbd: string;
//     pending_hp: string;
//     pending_posts_count: string;
//     total_author_rewards: string;
//     total_curator_payouts: string;
//   };
//   pending_posts: {
//     title: string;
//     permlink: string;
//     created: string;
//     cashout_time: string;
//     remaining_till_cashout: {
//       days: number;
//       hours: number;
//       minutes: number;
//       seconds: number;
//       milliseconds: number;
//     };
//     last_payout: string;
//     pending_payout_value: string;
//     author_rewards: string;
//     author_rewards_in_hive: string;
//     total_payout_value: string;
//     curator_payout_value: string;
//     beneficiary_payout_value: string;
//     total_rshares: string;
//     net_rshares: string;
//     total_vote_weight: string;
//     beneficiaries: string;
//     max_accepted_payout: string;
//     percent_hbd: number;
//     allow_votes: boolean;
//     allow_curation_rewards: boolean;
//   }[];
// }

export default function LeaderboardScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const { username } = useAuth();
  // const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  // const [balanceData, setBalancetData] = useState<BalancetData | null>(null);
  // const [showWallet, setShowWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //   if (username === "SPECTATOR") {
    //     setBalancetData({
    //       account_name: "SPECTATOR",
    //       hive: "0.000",
    //       hbd: "0.000",
    //       vests: "0.000000",
    //       hp_equivalent: "0.000",
    //       hive_savings: "0.000",
    //       hbd_savings: "0.000",
    //     });

    // // Sample pending posts data
    // const pendingPosts = [
    //   {
    //     title: "Cast",
    //     permlink: "20250322t212846952z",
    //     created: "2025-03-22T21:28:51.000Z",
    //     cashout_time: "2025-03-29T21:28:51.000Z",
    //     remaining_till_cashout: {
    //       days: 2,
    //       hours: 2,
    //       minutes: 52,
    //       seconds: 28,
    //       milliseconds: 939.114,
    //     },
    //     last_payout: "1969-12-31T23:59:59.000Z",
    //     pending_payout_value: "0.652",
    //     author_rewards: "0.000",
    //     author_rewards_in_hive: "0.000",
    //     total_payout_value: "0.000",
    //     curator_payout_value: "0.000",
    //     beneficiary_payout_value: "0.000",
    //     total_rshares: "1998435488436",
    //     net_rshares: "1998435488436",
    //     total_vote_weight: "1063097913587",
    //     beneficiaries: "[]",
    //     max_accepted_payout: "1000000.0",
    //     percent_hbd: 10000,
    //     allow_votes: true,
    //     allow_curation_rewards: true,
    //   },
    //   {
    //     title: "Cast",
    //     permlink: "20250322t184101574z",
    //     created: "2025-03-22T18:41:06.000Z",
    //     cashout_time: "2025-03-29T18:41:06.000Z",
    //     remaining_till_cashout: {
    //       days: 2,
    //       hours: 0,
    //       minutes: 4,
    //       seconds: 43,
    //       milliseconds: 939.114,
    //     },
    //     last_payout: "1969-12-31T23:59:59.000Z",
    //     pending_payout_value: "0.549",
    //     author_rewards: "0.000",
    //     author_rewards_in_hive: "0.000",
    //     total_payout_value: "0.000",
    //     curator_payout_value: "0.000",
    //     beneficiary_payout_value: "0.000",
    //     total_rshares: "1672473484204",
    //     net_rshares: "1672473484204",
    //     total_vote_weight: "840575235532",
    //     beneficiaries: "[]",
    //     max_accepted_payout: "1000000.0",
    //     percent_hbd: 10000,
    //     allow_votes: true,
    //     allow_curation_rewards: true,
    //   },
    // ];

    // // Sample rewards data
    // const rewardsData: RewardsData = {
    //   summary: {
    //     total_pending_payout: "0.000",
    //     pending_hbd: "0.000",
    //     pending_hp: "0.000",
    //     pending_posts_count: `${pendingPosts.length}`,
    //     total_author_rewards: "0.000",
    //     total_curator_payouts: "0.000",
    //   },
    //   pending_posts: pendingPosts,
    // };

    //     setRewardsData(rewardsData);
    setIsLoading(false);
    //     return;
    //   }
  }, [username]);

  useEffect(() => {
    // const fetchBalancetData = async () => {
    //   if (!username || username === "SPECTATOR") return;

    //   try {
    //     setIsLoading(true);
    //     const [rewardsData, balanceData] = await Promise.all([
    //       getRewards(username),
    //       getBalance(username),
    //     ]);

    //     if (rewardsData) {
    //       setRewardsData(rewardsData);
    //     }
    //     if (balanceData) {
    //       setBalancetData(balanceData);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching balance data:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // fetchBalancetData();
  }, [username]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-2 space-y-4">
          {/* Leaderboard Info Section */}
          <View className="w-full">

            {/* Display Learderboard */}
            <Leaderboard currentUsername={username} />

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
