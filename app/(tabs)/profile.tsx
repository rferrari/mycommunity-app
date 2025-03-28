import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAuth } from '~/lib/auth-provider';
import { API_BASE_URL } from '~/lib/constants';

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
      profile_image?: string;
      cover_image?: string;
      location?: string;
    }
  }
}

export default function ProfileScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const { username, logout } = useAuth();
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;

      try {
        if (username === 'SPECTATOR') {
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
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage('Error logging out');
    }
  };

  const handleQuit = async () => {
    try {
      await router.push('/');
    } catch (error) {
      console.error('Error quitting:', error);
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
            </View>
          </View>

          {/* Show Create Account CTA only for SPECTATOR */}
          {username === 'SPECTATOR' && (
            <View className="w-full py-6 bg-foreground/5 rounded-xl">
              <View className="items-center space-y-4 px-4">
                <Ionicons 
                  name="rocket-outline" 
                  size={48} 
                  color={isDarkColorScheme ? '#ffffff' : '#000000'} 
                />
                <Text className="text-xl font-bold text-center">
                  Ready to Start Your Journey?
                </Text>
                <Text className="text-center opacity-70">
                  Join our community and start earning rewards for your content
                </Text>
                <Button
                  onPress={handleWaitingList}
                  className="bg-foreground w-full"
                >
                  <Text className="text-background text-lg font-bold">
                    Create SkateHive Account
                  </Text>
                </Button>
              </View>
            </View>
          )}

          {/* Actions */}
          <View className="px-2 flex flex-col gap-1">
            <Button 
              onPress={handleQuit}
              className="bg-white"
            >
              <Text className="text-gray-900 text-lg">Back to Home</Text>
            </Button>
            
            <View className="h-px bg-foreground/10" />
            
            <Button 
              variant="destructive" 
              onPress={handleLogout}
              className="bg-red-500/80"
            >
              <Text className="text-white text-lg">Exit {username === 'SPECTATOR' ? 'Spectator Mode' : 'Account'}</Text>
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