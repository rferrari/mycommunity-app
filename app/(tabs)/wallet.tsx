import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from '~/lib/useColorScheme';
import { API_BASE_URL } from '~/lib/constants';
import { Ionicons } from '@expo/vector-icons';

interface WalletData {
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
}

export default function WalletScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [showWallet, setShowWallet] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await SecureStore.getItemAsync('lastLoggedInUser');
        if (currentUser) {
          setUsername(currentUser);

          if (currentUser === 'SPECTATOR') {
            setWalletData({
              account_name: 'SPECTATOR',
              hive: '0.000',
              hbd: '0.000',
              vests: '0.000000',
              hp_equivalent: '0.000',
              hive_savings: '0.000',
              hbd_savings: '0.000'
            });

            setRewardsData({
              summary: {
                total_pending_payout: '0.000',
                pending_hbd: '0.000',
                pending_hp: '0.000',
                pending_posts_count: '0',
                total_author_rewards: '0.000',
                total_curator_payouts: '0.000'
              }
            });
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!username || username === 'SPECTATOR') return;

      try {
        const [rewardsResponse, walletResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/wallet/${username}/rewards`),
          fetch(`${API_BASE_URL}/wallet/${username}`)
        ]);

        const rewardsJson = await rewardsResponse.json();
        const walletJson = await walletResponse.json();

        if (rewardsJson.success) {
          setRewardsData(rewardsJson.data);
        }
        if (walletJson.success) {
          setWalletData(walletJson.data);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [username]);

  if (isLoading) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={isDarkColorScheme ? '#ffffff' : '#000000'}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4 flex flex-col gap-4">
          {/* Header */}
          <Text className="text-2xl font-bold">Wallet</Text>

          {/* Wallet Section */}
          <View className="w-full py-6 bg-foreground/5 rounded-xl">
            <View className="flex-row items-center justify-between px-6">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold">Balance</Text>
              </View>
              <Pressable onPress={() => setShowWallet(!showWallet)}>
                <Ionicons
                  name={showWallet ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={isDarkColorScheme ? '#ffffff' : '#000000'}
                />
              </Pressable>
            </View>
            {showWallet && walletData && (
              <View className="px-6 mt-4 space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-lg opacity-70">HIVE:</Text>
                  <Text className="text-lg font-medium">{walletData.hive}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-lg opacity-70">HBD:</Text>
                  <Text className="text-lg font-medium">{walletData.hbd}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-lg opacity-70">HP:</Text>
                  <Text className="text-lg font-medium">{walletData.hp_equivalent}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-lg opacity-70">Savings:</Text>
                  <View className="items-end">
                    <Text className="text-lg font-medium">{walletData.hive_savings} HIVE</Text>
                    <Text className="text-lg font-medium">{walletData.hbd_savings} HBD</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Rewards Section */}
          {rewardsData && (
            <View className="w-full py-6 bg-foreground/5 rounded-xl">
              <View className="items-center mb-2">
                <Ionicons
                  name="trophy-outline"
                  size={48}
                  color={isDarkColorScheme ? '#FFD700' : '#DAA520'}
                />
                <Text className="text-xl font-bold mt-2">Rewards</Text>
              </View>
              <View className="px-6 mt-4">
                <View className="space-y-3">
                  <View className="flex-row justify-between">
                    <Text className="text-lg opacity-70">Pending Payout:</Text>
                    <Text className="text-lg font-medium">{rewardsData.summary.total_pending_payout} HBD</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg opacity-70">Pending Posts:</Text>
                    <Text className="text-lg font-medium">{rewardsData.summary.pending_posts_count}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg opacity-70">Author Rewards:</Text>
                    <Text className="text-lg font-medium">{rewardsData.summary.total_author_rewards}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-lg opacity-70">Curator Payouts:</Text>
                    <Text className="text-lg font-medium">{rewardsData.summary.total_curator_payouts}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}