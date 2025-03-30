import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuth } from "~/lib/auth-provider";
import { ProfileSpectatorInfo } from "~/components/SpectatorMode/ProfileSpectatorInfo";
import { useProfile } from "~/lib/hooks/useQueries";

export default function ProfileScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const { username, logout } = useAuth();
  const [message, setMessage] = useState("");
  const { data: profileData, isLoading } = useProfile(username);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      setMessage("Error logging out");
    }
  };

  const renderProfileImage = () => {
    if (username === "SPECTATOR") {
      return (
        <View className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <Ionicons
            name="person-outline"
            size={48}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
          />
        </View>
      );
    }

    return profileData?.posting_metadata.profile.profile_image ? (
      <Image
        source={{ uri: profileData.posting_metadata.profile.profile_image }}
        className="w-24 h-24 rounded-full"
      />
    ) : (
      <View className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <Ionicons
          name="person-outline"
          size={48}
          color={isDarkColorScheme ? "#ffffff" : "#000000"}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading profile</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
      {/* Top Exit Button */}
      <Pressable
        onPress={handleLogout}
        className="absolute top-12 right-6 z-10"
      >
        <View className="bg-foreground/20 rounded-full p-2">
          <Ionicons
            name="exit-outline"
            size={24}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
          />
          <Text>Exit</Text>
        </View>
      </Pressable>

      <ScrollView className="flex-1">
        <View className="p-2 space-y-4">
          {/* Profile Info Section */}
          <View className="items-center space-y-4">
            {renderProfileImage()}
            <View className="items-center">
              <Text className="text-2xl font-bold">
                {profileData.posting_metadata.profile.name || profileData.name}
              </Text>
              <Text className="text-muted-foreground">@{username}</Text>
            </View>
            {profileData.posting_metadata.profile.about && (
              <Text className="text-center">
                {profileData.posting_metadata.profile.about}
              </Text>
            )}
            {profileData.posting_metadata.profile.location && (
              <Text className="text-muted-foreground">
                📍 {profileData.posting_metadata.profile.location}
              </Text>
            )}
          </View>

          {/* Show Create Account CTA only for SPECTATOR */}
          {username === "SPECTATOR" && <ProfileSpectatorInfo />}

          {/* Stats Section */}
          <View className="flex-row justify-around bg-card p-4 rounded-lg">
            <View className="items-center">
              <Text className="font-bold">{profileData.followers}</Text>
              <Text className="text-muted-foreground">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="font-bold">{profileData.followings}</Text>
              <Text className="text-muted-foreground">Following</Text>
            </View>
            <View className="items-center">
              <Text className="font-bold">{profileData.total_posts}</Text>
              <Text className="text-muted-foreground">Posts</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
