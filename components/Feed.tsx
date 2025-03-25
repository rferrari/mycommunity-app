import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { Image, Modal, Pressable, View } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Text } from './ui/text';

interface Post {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  content: string;
  createdAt: Date;
  likes: number;
  earnings: number;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

function PostCard({ post }: { post: Post }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const video = React.useRef(null);

  const handleMediaPress = (url: string) => {
    setSelectedMedia(url);
    setIsModalVisible(true);
  };

  return (
    <Card className="w-full mb-4">
      <CardContent className="p-4">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center">
            <View className="h-10 w-10 mr-3 rounded-full overflow-hidden">
              <Image 
                source={{ uri: post.avatar }} 
                className="w-full h-full"
                alt={`${post.username}'s avatar`}
              />
            </View>
            <View>
              <Text className="font-bold text-lg">{post.username}</Text>
              <Text className="text-gray-500">@{post.handle}</Text>
            </View>
          </View>
          <Text className="text-gray-500 mt-1">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </Text>
        </View>
        
        <Text className="mb-3">{post.content}</Text>
        
        {post.media && post.media.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mb-3">
            {post.media.map((media, index) => (
              <Pressable
                key={index}
                onPress={() => handleMediaPress(media.url)}
                className={`${post.media?.length === 1 ? 'w-full' : 'w-[49%]'} aspect-square rounded-lg overflow-hidden`}
              >
                {media.type === 'image' ? (
                  <Image
                    source={{ uri: media.url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Video
                    ref={video}
                    source={{ uri: media.url }}
                    className="w-full h-full"
                    resizeMode={ResizeMode.COVER}
                    useNativeControls={false}
                    shouldPlay={false}
                    isLooping
                  />
                )}
              </Pressable>
            ))}
          </View>
        )}
        
        <View className="flex-row justify-between items-center">
          <Text className="text-green-600 font-bold">
            ${post.earnings.toFixed(2)}
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
            <Text className="text-gray-600">{post.likes}</Text>
          </Pressable>
        </View>
      </CardContent>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/80 justify-center items-center"
          onPress={() => setIsModalVisible(false)}
        >
          <View className="w-full h-[80%] justify-center">
            {selectedMedia && (
              <Image
                source={{ uri: selectedMedia }}
                className="w-full h-full"
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </Card>
  );
}

export function Feed() {
  const samplePosts: Post[] = [
    {
      id: '1',
      username: 'John Doe',
      handle: 'johndoe',
      avatar: 'https://api.dicebear.com/9.x/pixel-art/png?seed=john',
      content: 'Just launched my new project! 🚀',
      createdAt: new Date('2025-03-24T10:00:00'),
      likes: 42,
      earnings: 15.50,
    },
    {
      id: '2',
      username: 'Jane Smith',
      handle: 'janesmith',
      avatar: 'https://api.dicebear.com/9.x/pixel-art/png?seed=jane',
      content: 'Check out these amazing photos from my trip!',
      createdAt: new Date('2025-03-24T09:30:00'),
      likes: 127,
      earnings: 45.75,
      media: [
        { type: 'image', url: 'https://picsum.photos/400/300' },
        { type: 'image', url: 'https://picsum.photos/400/301' },
      ],
    }
  ];

  return (
    <View className="w-full gap-4">
      <Text className="text-2xl font-bold mb-2">Latest Posts</Text>
      {samplePosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </View>
  );
}