import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Keyboard, Pressable, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { VideoPlayer } from "~/components/feed/VideoPlayer";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasVideoInteraction, setHasVideoInteraction] = useState(false);

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
      // Determine media type based on the URI or result type
      setMediaType(result.assets[0].mimeType?.includes("video") ? 'video' : 'image');
      setIsVideoPlaying(false);
      setHasVideoInteraction(false);
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
      <View className="flex-1 bg-background p-4">
        <Card>
          <TextInput
            multiline
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            className="p-4 text-foreground text-lg min-h-[30vh]"
            placeholderTextColor="#666"
            style={{ textAlignVertical: "top" }}
            numberOfLines={5}
          />

          {media && (
            <View className="relative mx-4 rounded-lg overflow-hidden" style={{ height: 200 }}>
              {mediaType === 'image' ? (
                <Image
                  source={{ uri: media }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : mediaType === 'video' ? (
                hasVideoInteraction ? (
                  <VideoPlayer url={media} playing={isVideoPlaying} />
                ) : (
                  <Pressable 
                    className="w-full h-full" 
                    onPress={handleVideoPress}
                  >
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
        </Card>

        <View className="flex-row items-center justify-between p-4 border-t border-border">
          <Pressable
            onPress={pickMedia}
            className="flex-row items-center"
            disabled={isUploading}
          >
            <Ionicons name="image-outline" size={24} color="#666" />
            <Text className="ml-2 text-foreground/60">Add media</Text>
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
      </View>
    </TouchableWithoutFeedback>
  );
}
