import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuth } from "~/lib/auth-provider";
import { ProfileSpectatorInfo } from "~/components/SpectatorMode/ProfileSpectatorInfo";
import { useProfile, useUserFeed } from "~/lib/hooks/useQueries";
import { PostCard } from "~/components/Feed/PostCard";
import type { Post } from "~/lib/types";
import { LoadingScreen } from "~/components/ui/LoadingScreen";

export default function ProfileScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const { username: currentUsername, logout } = useAuth();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState("");

  // Use the URL param username if available, otherwise use current user's username
  const profileUsername = (params.username as string) || currentUsername;

  const { data: profileData, isLoading: isLoadingProfile } =
    useProfile(profileUsername);
  const {
    data: userFeed,
    isLoading: isLoadingFeed,
    refetch: refetchFeed,
  } = useUserFeed(profileUsername);

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
    if (profileUsername === "SPECTATOR") {
      return (
        <View className="w-24 h-24 rounded-full bg-foreground/10 flex items-center justify-center">
          <Ionicons
            name="eye-outline"
            size={48}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
          />
        </View>
      );
    }

    const profileImage = profileData?.posting_metadata?.profile?.profile_image;
    const hiveAvatarUrl = `https://images.hive.blog/u/${profileUsername}/avatar/small`;

    if (profileImage) {
      return (
        <Image
          source={{ uri: profileImage }}
          className="w-24 h-24 rounded-full"
        />
      );
    }

    // Use Hive avatar as fallback
    if (profileUsername && profileUsername !== "SPECTATOR") {
      return (
        <Image
          source={{ uri: hiveAvatarUrl }}
          className="w-24 h-24 rounded-full"
        />
      );
    }

    // Default icon as last resort
    return (
      <View className="w-24 h-24 rounded-full bg-foreground/10 flex items-center justify-center">
        <Ionicons
          name="person-outline"
          size={48}
          color={isDarkColorScheme ? "#ffffff" : "#000000"}
        />
      </View>
    );
  };

  if (isLoadingProfile) {
    return (
      <LoadingScreen />
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
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={isLoadingFeed} onRefresh={refetchFeed} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Top Exit/Back Button */}
      {!params.username && (
        <Pressable
          onPress={handleLogout}
          className="absolute top-6 right-6 z-10"
        >
          <View className="bg-foreground/20 rounded-full py-2 px-4 flex flex-row items-center gap-2">
            <Text>Exit</Text>
            <Ionicons
              name="exit-outline"
              size={16}
              color={isDarkColorScheme ? "#ffffff" : "#000000"}
            />
          </View>
        </Pressable>
      )}

      {/* Profile Info Section */}
      <View className="items-center gap-2 pt-6">
        {renderProfileImage()}
        <View className="items-center">
          <Text className="text-3xl font-bold">
            {profileData?.posting_metadata?.profile?.name || profileData.name}
          </Text>
          <Text className="text-muted-foreground">@{profileUsername}</Text>
        </View>
        {profileData?.posting_metadata?.profile?.about && (
          <Text className="text-center">
            {profileData.posting_metadata.profile.about}
          </Text>
        )}
        {/* {profileData?.posting_metadata?.profile?.location && (
          <Text className="text-muted-foreground">
            📍 {profileData.posting_metadata.profile.location}
          </Text>
        )} */}
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-around bg-card p-4 rounded-lg">
        <View className="items-center">
          <Text className="font-bold">{profileData?.community_followers || "0"}</Text>
          <Text className="text-muted-foreground">Followers</Text>
        </View>
        <View className="items-center">
          <Text className="font-bold">{profileData?.community_followings || "0"}</Text>
          <Text className="text-muted-foreground">Following</Text>
        </View>
        <View className="items-center">
          <Text className="font-bold">{profileData?.community_totalposts || "0"}</Text>
          <Text className="text-muted-foreground">Posts</Text>
        </View>
      </View>

      <View className="flex-row justify-around bg-card p-4 rounded-lg">
        <View className="items-center">
          <Text className="font-bold">{profileData?.vp_percent || "0"}</Text>
          <Text className="text-muted-foreground">Voting Power</Text>
        </View>
        <View className="items-center">
          <Text className="font-bold">{profileData?.rc_percent || "0"}</Text>
          <Text className="text-muted-foreground">Resource Credits</Text>
        </View>
      </View>

      {/* Show Create Account CTA only for SPECTATOR */}
      {profileUsername === "SPECTATOR" ? (
        <ProfileSpectatorInfo />
      ) : (
        <View className="flex flex-col gap-4">
          {isLoadingFeed ? (
            <ActivityIndicator size="large" />
          ) : userFeed && userFeed.length > 0 ? (
            userFeed.map((post: Post) => (
              <React.Fragment key={post.permlink}>
                <View className="h-0 my-4 border border-muted" />
                <PostCard
                  key={post.permlink}
                  post={post}
                  currentUsername={currentUsername}
                />
              </React.Fragment>
            ))
          ) : (
            <Text className="text-center text-muted-foreground">
              No posts yet
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
