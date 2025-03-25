import React, { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '../ui/card';
import { Text } from '../ui/text';
import { MediaPreview } from './MediaPreview';
import type { Post, Media } from './types';
import { extractMediaFromBody } from './types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const handleMediaPress = useCallback((media: Media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  }, []);

  const media = extractMediaFromBody(post.body);

  return (
    <Card className="w-full mb-4">
      <CardContent className="p-4">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center">
            <View className="h-10 w-10 mr-3 rounded-full overflow-hidden">
              <Image
                source={{ uri: `https://images.ecency.com/webp/u/${post.author}/avatar/small` }}
                className="w-full h-full"
                alt={`${post.author}'s avatar`}
              />
            </View>
            <View>
              <Text className="font-bold text-lg">{post.author}</Text>
              <Text className="text-gray-500">@{post.author}</Text>
            </View>
          </View>
          <Text className="text-gray-500 mt-1">
            {formatDistanceToNow(new Date(post.created), { addSuffix: true })}
          </Text>
        </View>

        <Text className="mb-3">{post.body.replace(/<iframe.*?<\/iframe>|!\[.*?\]\(.*?\)/g, '')}</Text>

        {media.length > 0 && (
          <MediaPreview
            media={media}
            onMediaPress={handleMediaPress}
            selectedMedia={selectedMedia}
            isModalVisible={isModalVisible}
            onCloseModal={() => setIsModalVisible(false)}
          />
        )}

        <View className="flex-row justify-between items-center">
          <Text className="text-green-600 font-bold">
            ${parseFloat(post.total_payout_value).toFixed(3)}
          </Text>
          <Pressable
            onPress={() => setIsLiked(!isLiked)}
            className="flex-row items-center"
          >
            <FontAwesome
              name={isLiked ? "heart" : "heart-o"}
              size={20}
              color={isLiked ? "#ff4444" : "#666666"}
              style={{ marginRight: 4 }}
            />
            <Text className="text-gray-600">{Math.floor(post.total_vote_weight / 1000000)}</Text>
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}