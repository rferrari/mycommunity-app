import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import { VideoPlayer } from "~/components/Feed/VideoPlayer";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuth } from "~/lib/auth-provider";
import { API_BASE_URL } from "~/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { CreateSpectatorInfo } from "~/components/SpectatorMode/CreateSpectatorInfo";

export default function CreatePost() {
  const { isDarkColorScheme } = useColorScheme();
  const { username } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [mediaMimeType, setMediaMimeType] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSelectingMedia, setIsSelectingMedia] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoInteraction, setHasVideoInteraction] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pickMedia = async () => {
    try {
      setIsSelectingMedia(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 0.75,
        exif: false,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type === "video" ? "video" : "image");

        // Get the actual MIME type from the asset
        if (asset.mimeType) {
          // Use the MIME type directly from the asset if available
          setMediaMimeType(asset.mimeType);
        } else {
          // Fallback to detection based on file extension
          const fileExtension = asset.uri.split(".").pop()?.toLowerCase();
          if (asset.type === "image") {
            // Map common image extensions to MIME types
            const imageMimeTypes: Record<string, string> = {
              jpg: "image/jpeg",
              jpeg: "image/jpeg",
              png: "image/png",
              gif: "image/gif",
              webp: "image/webp",
              heic: "image/heic",
            };
            setMediaMimeType(
              imageMimeTypes[fileExtension || ""] || "image/jpeg"
            );
          } else {
            // Map common video extensions to MIME types
            const videoMimeTypes: Record<string, string> = {
              mp4: "video/mp4",
              mov: "video/quicktime",
              avi: "video/x-msvideo",
              wmv: "video/x-ms-wmv",
              webm: "video/webm",
            };
            setMediaMimeType(
              videoMimeTypes[fileExtension || ""] || "video/mp4"
            );
          }
        }

        setIsVideoPlaying(false);
        setHasVideoInteraction(false);
      }
    } catch (error) {
      console.error("Error selecting media:", error);
    } finally {
      setIsSelectingMedia(false);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaType(null);
    setMediaMimeType(null);
    setIsVideoPlaying(false);
    setHasVideoInteraction(false);
  };

  const handleVideoPress = () => {
    if (!hasVideoInteraction) {
      setIsVideoPlaying(true);
      setHasVideoInteraction(true);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !media) return;

    // Check if user is authenticated
    if (!username || username === "SPECTATOR") {
      Alert.alert("Authentication Required", "Please log in to create a post");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // Get user's posting key from secure storage
      const postingKey = await SecureStore.getItemAsync(username);
      if (!postingKey) {
        throw new Error("Authentication error: Posting key not found");
      }

      // Prepare post data as JSON
      const postData: {
        author: string;
        body: string;
        media?: {
          data: string;
          type: string;
          name: string;
        };
      } = {
        author: username,
        body: content,
      };

      // Handle media if it exists
      if (media) {
        try {
          // Convert media file to base64
          const base64Data = await FileSystem.readAsStringAsync(media, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const fileName =
            media.split("/").pop() ||
            `${Date.now()}.${mediaType === "image" ? "jpg" : "mp4"}`;
          const fileType =
            mediaMimeType || (mediaType === "image" ? "image/jpeg" : "video/mp4");

          // Add media to post data
          postData.media = {
            data: base64Data,
            type: fileType,
            name: fileName,
          };
        } catch (fileError) {
          console.error("Error encoding media:", fileError);
          throw new Error("Failed to process media file");
        }
      }

      // Send the post data as JSON
      const response = await fetch(`${API_BASE_URL}/createpost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${postingKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      // Success - show confirmation and navigate to feed
      Alert.alert("Success", "Your post has been published!");

      // Clear form after successful post
      setContent("");
      setMedia(null);
      setMediaType(null);
      setMediaMimeType(null);

      // Invalidate queries to refresh feed data when navigating back to feed
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["trending"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["userFeed", username] });

      // Navigate to feed to see the new post
      router.push("/(tabs)/feed");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      setErrorMessage(errorMsg);
      Alert.alert("Error", errorMsg);
      console.error("Post error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-background">
      {username === "SPECTATOR" ? (
        <CreateSpectatorInfo />
      ) : (
        <View className="flex flex-col gap-4">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Header */}
          <Text className="text-3xl font-bold mt-3 mb-2">Create Post</Text>

          <Card>
            <TextInput
              multiline
              placeholder="What's on your mind?"
              value={content}
              onChangeText={setContent}
              className="p-4 text-foreground text-lg min-h-[20vh]"
              placeholderTextColor="#666"
              style={{ textAlignVertical: "top" }}
              numberOfLines={5}
            />
          </Card>

          <View className="flex-row items-center justify-between p-4 border-t border-border">
            <Pressable
              onPress={pickMedia}
              className="flex-row items-center"
              disabled={isUploading || isSelectingMedia}
            >
              {isSelectingMedia ? (
                <>
                  <View className="w-6 h-6 items-center justify-center">
                    <ActivityIndicator size="small" />
                  </View>
                  <Text className="ml-2 text-foreground/60">Selecting...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="image-outline" size={24} color="#666" />
                  <Text className="ml-2 text-foreground/60">
                    {media ? "Replace media" : "Add media"}
                  </Text>
                </>
              )}
            </Pressable>

            <Button
              onPress={handlePost}
              disabled={(!content.trim() && !media) || isUploading}
            >
              <Text className="font-medium">
                {isUploading ? "Posting..." : "Post"}
              </Text>
            </Button>
          </View>

          {media && (
            <View className="relative border border-muted rounded-lg overflow-hidden w-full aspect-square mt-4">
              {mediaType === "image" ? (
                <Image
                  source={{ uri: media }}
                  style={{ resizeMode: "cover", width: "100%", height: "100%" }}
                />
              ) : mediaType === "video" ? (
                hasVideoInteraction ? (
                  <VideoPlayer url={media} playing={isVideoPlaying} />
                ) : (
                  <Pressable className="w-full h-full" onPress={handleVideoPress}>
                    <VideoPlayer url={media} playing={false} />
                    <View className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <FontAwesome name="play-circle" size={50} color="white" />
                    </View>
                  </Pressable>
                )
              ) : null}
              <Pressable
                onPress={removeMedia}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
              >
                <Ionicons name="close" size={20} color="white" />
              </Pressable>
            </View>
          )}
        </TouchableWithoutFeedback>
        </View>
      )}
    </ScrollView>
  );
}  
