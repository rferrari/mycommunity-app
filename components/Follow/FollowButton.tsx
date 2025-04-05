import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { API_BASE_URL } from "~/lib/constants";
import { useAuth } from "~/lib/auth-provider";
import * as SecureStore from 'expo-secure-store';
import { useToast } from '~/lib/toast-provider';
import { View } from "react-native";
import { Plus, Minus } from "lucide-react-native";


interface Props {
  currentUsername: string | null;
  profileUsername: string | null;
  // type?: "mini" | "normal";
}

export function FollowButton({ currentUsername, profileUsername }: Props) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const { username } = useAuth();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/following/${username}`);
        const result = await response.json();
        const following = result.data.some(
          (entry: { following_name: string }) => entry.following_name === profileUsername
        );
        setIsFollowing(following);
      } catch (err) {
        console.error("Failed to fetch following list", err);
      }
    };

    if (
      currentUsername &&
      profileUsername &&
      currentUsername !== profileUsername &&
      profileUsername !== "SPECTATOR" &&
      currentUsername !== "SPECTATOR"
    ) {
      fetchFollowing();
    }
  }, [currentUsername, profileUsername, username]);

  const handleToggleFollow = async () => {
    if (!currentUsername || !profileUsername) return;
    setLoading(true);

    const password = await SecureStore.getItemAsync(currentUsername);
    if (!password) {
      showToast('Invalid credentials', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          follower: currentUsername,
          following: profileUsername,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsFollowing((prev) => !prev);
      } else {
        console.error("Follow API failed:", result.error);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setLoading(false);
    }
  };

  if (
    profileUsername === "SPECTATOR" ||
    currentUsername === profileUsername ||
    isFollowing === null
  ) {
    return null;
  }

  return (
    <Button
      className="mt-2 min-w-[120px]"
      onPress={handleToggleFollow}
      disabled={loading || isFollowing === null}
    >
      {loading || isFollowing === null ? (
        <>
          <ActivityIndicator size="small" />
          {/* <Text className="ml-2">Loading</Text> */}
        </>
      ) : isFollowing ? (
        <>
          <Text>Unfollow</Text>
        </>
      ) : (
        <>
          <Text>Follow</Text>
        </>
      )}
    </Button>
  );
}
