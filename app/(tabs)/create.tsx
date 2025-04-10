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
} from "react-native";
import { VideoPlayer } from "~/components/Feed/VideoPlayer";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";

export default function CreatePost() {
  const { isDarkColorScheme } = useColorScheme();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSelectingMedia, setIsSelectingMedia] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoInteraction, setHasVideoInteraction] = useState(false);

  const pickMedia = async () => {
    try {
      setIsSelectingMedia(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 0.75,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setMedia(asset.uri);
        setMediaType(asset.type === "video" ? "video" : "image");
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

    setIsUploading(true);
    try {
      // TODO: Implement post creation logic here
      // If there's media, upload it first
      // Then create the post with the media URL

      // Clear form after successful post
      setContent("");
      setMedia(null);
    } catch (error) {
      // TODO: Handle error
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="flex-1 bg-background p-2">
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
