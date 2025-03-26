import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';
import { API_BASE_URL } from '~/lib/constants';
import { Ionicons } from '@expo/vector-icons';

interface ProfileData {
  name: string;
  reputation: string;
  followers: string;
  followings: string;
  total_posts: string;
  posting_metadata: {
    profile: {
      name: string;
      about: string;
      profile_image: string;
      cover_image: string;
      location: string;
    };
  };
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

interface WalletData {
  account_name: string;
  hive: string;
  hbd: string;
  vests: string;
  hp_equivalent: string;
  hive_savings: string;
  hbd_savings: string;
}

export default function ProfileScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await SecureStore.getItemAsync('lastLoggedInUser');
        if (currentUser) {
          setUsername(currentUser);
        } else {
          router.push('/'); // Redirect to landing if no user found
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        router.push('/');
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return; // Don't fetch if no username

      try {
        const [profileResponse, rewardsResponse, walletResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/profile/${username}`),
          fetch(`${API_BASE_URL}/wallet/${username}/rewards`),
          fetch(`${API_BASE_URL}/wallet/${username}`)
        ]);

        const profileJson = await profileResponse.json();
        const rewardsJson = await rewardsResponse.json();
        const walletJson = await walletResponse.json();

        if (profileJson.success) {
          setProfileData(profileJson.data);
        }
        if (rewardsJson.success) {
          setRewardsData(rewardsJson.data);
        }
        if (walletJson.success) {
          setWalletData(walletJson.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  const handleLogout = async () => {
    try {
      // Get the last logged in user
      const lastLoggedInUser = await SecureStore.getItemAsync('lastLoggedInUser');
      
      if (lastLoggedInUser) {
        // Delete only this user's credentials
        await SecureStore.deleteItemAsync(lastLoggedInUser);
        // Clear last logged in user reference
        await SecureStore.deleteItemAsync('lastLoggedInUser');
        
        setMessage('Logged out successfully');
      }
      
      // Navigate back to landing page
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage('Error logging out');
    }
  };

  const handleQuit = () => {
    // Simply navigate back to landing page without clearing credentials
    router.push('/');
  };

  const WalletSection = () => (
    <View className="w-full py-6 bg-foreground/5 rounded-xl">
      <View className="flex-row items-center justify-between px-6">
        <View className="flex-row items-center">
          <Ionicons 
            name="wallet-outline" 
            size={24} 
            color={isDarkColorScheme ? '#ffffff' : '#000000'} 
            style={{ marginRight: 8 }}
          />
          <Text className="text-xl font-bold">Wallet</Text>
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
  );

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-2 space-y-4">
          {/* Profile Info Section */}
          {profileData && (
            <View className="w-full">
              <View className="items-center py-4">
                {profileData.posting_metadata.profile.profile_image && (
                  <Image
                    source={{ uri: profileData.posting_metadata.profile.profile_image }}
                    className="w-24 h-24 rounded-full"
                    style={{ borderWidth: 3, borderColor: isDarkColorScheme ? '#ffffff20' : '#00000020' }}
                  />
                )}
                <View className="items-center mt-2">
                  <Text className="text-xl font-bold">{profileData.posting_metadata.profile.name}</Text>
                  <Text className="text-sm opacity-70">@{profileData.name}</Text>
                  <Text className="mt-2 text-center px-4">{profileData.posting_metadata.profile.about}</Text>
                </View>
                <View className="flex-row justify-around w-full mt-4">
                  <View className="items-center">
                    <Text className="font-bold">{profileData.followers}</Text>
                    <Text>Followers</Text>
                  </View>
                  <View className="items-center">
                    <Text className="font-bold">{profileData.followings}</Text>
                    <Text>Following</Text>
                  </View>
                  <View className="items-center">
                    <Text className="font-bold">{profileData.total_posts}</Text>
                    <Text>Posts</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Add Wallet Section here */}
          {walletData && <WalletSection />}

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

          {/* Actions */}
          <View className="px-2 space-y-3">
            <Button 
              onPress={handleQuit}
              className="bg-white"
            >
              <Text className="text-gray-900 text-lg">Quit to Home</Text>
            </Button>
            
            <View className="h-px bg-foreground/10" />
            
            <Button 
              variant="destructive" 
              onPress={handleLogout}
              className="bg-red-500/80"
            >
              <Text className="text-white text-lg">Logout</Text>
            </Button>

            {message && (
              <Text className="text-sm text-center opacity-70 mt-2">{message}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}