import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import { API_BASE_URL } from '~/lib/constants';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from "~/lib/useColorScheme";
import { Crown } from 'lucide-react-native';
import { LoadingScreen } from '../ui/LoadingScreen';

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

interface ProfileProps {
  profileData: ProfileData;
}

export function Profile(
  { profileData }: ProfileProps
) {
  const { isDarkColorScheme } = useColorScheme();
  // const [skaters, setSkaters] = useState<LeaderboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // const [currentUserPosition, setCurrentUserPosition] = useState<string>("0");
  // const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  // const [currentUserScore, setCurrentUserScore] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }


  const renderProfileImage = () => {
    if (profileData.name === 'SPECTATOR') {
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


  return (
    <View className="w-full py-4">
      <View className="items-center">

              {/* Profile Info Section */}
              <View className="w-full">
                <View className="items-center py-4">
                  {renderProfileImage()}
                  <View className="items-center mt-2">
                    <Text className="text-xl font-bold">
                      {profileData?.posting_metadata.profile.name}
                    </Text>
                    <Text className="text-sm opacity-70">
                      @{profileData?.name || 'SPECTATOR'}
                    </Text>
                    <Text className="mt-2 text-center px-4">
                      {profileData?.posting_metadata.profile.about}
                    </Text>
                  </View>

                  {profileData.name !== 'SPECTATOR' && (
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


              {/* Show Create Account CTA only for SPECTATOR */}
              {profileData.name === 'SPECTATOR' && (
                <ProfileSpectatorInfo />
              )}

              {/* Actions */}
              <View className="px-2 flex flex-col gap-1">
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
        );
}