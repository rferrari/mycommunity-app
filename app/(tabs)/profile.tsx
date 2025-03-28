import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';
import { API_BASE_URL, STORED_USERS_KEY } from '~/lib/constants';
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

export default function ProfileScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [storedUsers, setStoredUsers] = React.useState<string[]>([]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await SecureStore.getItemAsync('lastLoggedInUser');
        if (currentUser) {
          setUsername(currentUser);

          if (currentUser === 'SPECTATOR') {
            setProfileData({
              name: 'SPECTATOR',
              reputation: '0',
              followers: '0',
              followings: '0',
              total_posts: '0',
              posting_metadata: {
                profile: {
                  name: 'Spectator Mode',
                  about: 'Browse and explore content without logging in.',
                  profile_image: '',
                  cover_image: '',
                  location: '',
                }
              }
            });
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        router.push('/');
      } finally {
        setIsInitializing(false);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;

      try {
        const profileResponse = await fetch(`${API_BASE_URL}/profile/${username}`);
        const profileJson = await profileResponse.json();

        if (profileJson.success) {
          setProfileData(profileJson.data);
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
      const lastLoggedInUser = await SecureStore.getItemAsync('lastLoggedInUser');
      const storedUsersJson = await SecureStore.getItemAsync(STORED_USERS_KEY);
      let users: string[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];

      if (lastLoggedInUser) {
        // Remove the user from the stored users list
        users = users.filter(user => user !== lastLoggedInUser);

        // Update the stored users
        await SecureStore.setItemAsync(STORED_USERS_KEY, JSON.stringify(users));

        // Delete the last logged in user
        await SecureStore.deleteItemAsync('lastLoggedInUser');

        // Delete the user's stored data
        await SecureStore.deleteItemAsync(lastLoggedInUser);

        setStoredUsers(users);
        setMessage('Logged out successfully');
      }

      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage('Error logging out');
    }
  };

  const handleQuit = async () => {
    try {
      await SecureStore.setItemAsync('manualQuit', 'true');
      router.push('/');
    } catch (error) {
      console.error('Error setting quit flag:', error);
    }
  };

  const handleWaitingList = () => {
    router.push('/(onboarding)/home');
  };

  const renderProfileImage = () => {
    if (username === 'SPECTATOR') {
      return (
        <View
          className="w-24 h-24 rounded-full bg-foreground/10 items-center justify-center"
          style={{ borderWidth: 3, borderColor: isDarkColorScheme ? '#ffffff20' : '#00000020' }}
        >
          <Ionicons
            name="person-circle-outline"
            size={64}
            color={isDarkColorScheme ? '#ffffff' : '#000000'}
          />
        </View>
      );
    }

    return profileData?.posting_metadata.profile.profile_image ? (
      <Image
        source={{ uri: profileData.posting_metadata.profile.profile_image }}
        className="w-24 h-24 rounded-full"
        style={{ borderWidth: 3, borderColor: isDarkColorScheme ? '#ffffff20' : '#00000020' }}
      />
    ) : null;
  };

  if (isInitializing || (isLoading && !username)) {
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
        <View className="p-2 space-y-4">
          {/* Profile Info Section */}
          <View className="w-full">
            <View className="items-center py-4">
              {renderProfileImage()}
              <View className="items-center mt-2">
                <Text className="text-xl font-bold">
                  {profileData?.posting_metadata.profile.name || 'Spectator Mode'}
                </Text>
                <Text className="text-sm opacity-70">
                  @{profileData?.name || 'SPECTATOR'}
                </Text>
                <Text className="mt-2 text-center px-4">
                  {profileData?.posting_metadata.profile.about || 'Browse and explore content without logging in.'}
                </Text>
              </View>

              {username !== 'SPECTATOR' && (
                <View className="flex-row justify-around w-full mt-4">
                  <View className="items-center">
                    <Text className="font-bold">{profileData?.followers || '0'}</Text>
                    <Text>Followers</Text>
                  </View>
                  <View className="items-center">
                    <Text className="font-bold">{profileData?.followings || '0'}</Text>
                    <Text>Following</Text>
                  </View>
                  <View className="items-center">
                    <Text className="font-bold">{profileData?.total_posts || '0'}</Text>
                    <Text>Posts</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Actions for Spectator Mode */}
          {username === 'SPECTATOR' && (
            <View className="w-full py-6 bg-foreground/5 rounded-xl">
              <View className="items-center space-y-4 px-4">
                <Ionicons
                  name="rocket-outline"
                  size={48}
                  color={isDarkColorScheme ? '#ffffff' : '#000000'}
                />
                <Text className="text-xl font-bold text-center">
                  Learn about SkateHive
                </Text>
                <Text className="text-center opacity-70">
                  Skatehive is a global community that unites skaters, content creators, and enthusiasts to share, learn, and collaborate. Rooted in a spirit of openness and creativity, Skatehive fosters a space where skaters can connect without barriers, celebrate each other’s achievements, and grow together. With a focus on decentralization, Skatehive empowers its members to be active contributors and shape the direction of the community through their participation.
                </Text>

                <Text className="text-xl font-bold text-center">
                  Enter Skatehive: The Next Leap
                </Text>
                <Text>
                  Now, Skatehive is taking the next step in this evolution by introducing a platform that not only allows skaters to create and share content but also rewards them for their contributions. With its decentralized model and innovative features, Skatehive is revolutionizing how skateboarders engage with media, offering a new way to interact, collaborate, and build together.
                </Text>


                <Image
                  source={{ uri: 'https://docs.skatehive.app/assets/images/1-cb7853cd74328efcabe5379a14a95583.png' }}
                  className="w-24 h-24 rounded-full"
                  style={{ borderWidth: 3, borderColor: isDarkColorScheme ? '#ffffff20' : '#00000020' }}
                />
                <Text className="text-xl font-bold text-center">
                  Decentralized Sponsorship Through Post Rewards
                </Text>



                <Text className="text-xl font-bold text-center">
                  Public Goods and Community Support
                </Text>



                <Text className="text-xl font-bold text-center">
                  Challenging the Monopoly of Skateboard Media
                </Text>



                <Text className="text-xl font-bold text-center">
                  Open-Source Technology and a Growing Network
                </Text>



                <Text className="text-xl font-bold text-center">
                  Building Together
                </Text>


                <Image
                  source={{ uri: 'https://docs.skatehive.app/assets/images/1-cb7853cd74328efcabe5379a14a95583.png' }}
                  className="w-24 h-24 rounded-full"
                  style={{ borderWidth: 3, borderColor: isDarkColorScheme ? '#ffffff20' : '#00000020' }}
                />
                <Text className="text-xl font-bold text-center">
                  Create Account
                  https://docs.skatehive.app/docs/create-account
                </Text>


                <Image
                  source={{ uri: 'https://docs.skatehive.app/assets/images/1-cb7853cd74328efcabe5379a14a95583.png' }}
                  className="w-24 h-24 rounded-full"
                  style={{ borderWidth: 3, borderColor: isDarkColorScheme ? '#ffffff20' : '#00000020' }}
                />
                <Text className="text-xl font-bold text-center">
                  Level 1(https://docs.skatehive.app/docs/Level%20-%201/login)
                </Text>



                <Image
                  source={{ uri: 'https://docs.skatehive.app/assets/images/1-cb7853cd74328efcabe5379a14a95583.png' }}
                  className="w-24 h-24 rounded-full"
                  style={{ borderWidth: 3, borderColor: isDarkColorScheme ? '#ffffff20' : '#00000020' }}
                />


                <Text className="text-xl font-bold text-center">
                  Level 2(https://docs.skatehive.app/docs/Level%20-%202/airdrop)
                </Text>

                <Text className="text-xl font-bold text-center">
                  [Level Pro]()
                </Text>

                <Text>
                  Skater Devevoper: We are Hiring!
                  https://docs.skatehive.app/docs/Level%20-%202/airdrop
                </Text>

                <Text>

                </Text>

                <Text>

                </Text>

                <Button
                  onPress={handleWaitingList}
                  className="bg-foreground w-full"
                >
                  <Text className="text-background text-lg font-bold">
                    Ready to Start Your Journey?
                  </Text>
                </Button>
              </View>
            </View>
          )}

          {/* Actions for logged-in users */}
          {username !== 'SPECTATOR' && (
            <View className="px-2 flex flex-col gap-1">
              <Button
                variant="destructive"
                onPress={handleLogout}
                className="bg-red-500/80"
              >
                <Text className="text-white text-lg">Exit Account</Text>
              </Button>

              {message && (
                <Text className="text-sm text-center opacity-70 mt-2">{message}</Text>
              )}
            </View>
          )}

          <Button
            onPress={handleQuit}
            className="bg-foreground w-full"
          >
            <Text className="text-background text-lg font-bold">
              Go Back Home
            </Text>
          </Button>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}