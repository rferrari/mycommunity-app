import React, { useState } from 'react';
import { View, ScrollView, Image, Pressable, Modal, TextInput } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Video, ResizeMode } from 'expo-av';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

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

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [foundPassword, setFoundPassword] = useState('');

  const saveCredentials = async () => {
    try {
      if (!username || !password) {
        setMessage('Please enter both username and password');
        return;
      }

      await SecureStore.setItemAsync(username, password);
      setMessage('Credentials saved successfully!');
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage('Error saving credentials');
      console.error(error);
    }
  };

  const retrievePassword = async () => {
    try {
      if (!searchUsername) {
        setMessage('Please enter a username to search');
        return;
      }

      const storedPassword = await SecureStore.getItemAsync(searchUsername);
      if (storedPassword) {
        setFoundPassword(storedPassword);
        setMessage('Password retrieved successfully!');
      } else {
        setFoundPassword('');
        setMessage('No password found for this username');
      }
    } catch (error) {
      setMessage('Error retrieving password');
      console.error(error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-secondary/30">
      <View className="p-6">
        <Card className="w-full max-w-sm rounded-2xl mx-auto mb-6">
          <CardHeader>
            <CardTitle className='py-2 text-center'>Profile</CardTitle>
          </CardHeader>
          <CardContent className='gap-4'>
            <View className='gap-4'>
              <Text className='text-base font-medium'>Save Credentials</Text>
              <TextInput
                className='w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600'
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                className='w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600'
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button onPress={saveCredentials}>
                <Text>Save Credentials</Text>
              </Button>
            </View>

            <View className='gap-4 mt-4'>
              <Text className='text-base font-medium'>Retrieve Password</Text>
              <TextInput
                className='w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600'
                placeholder="Enter username to search"
                value={searchUsername}
                onChangeText={setSearchUsername}
              />
              <Button onPress={retrievePassword}>
                <Text>Find Password</Text>
              </Button>
              {foundPassword && (
                <View className='p-2 bg-muted rounded-lg'>
                  <Text>Found Password: {foundPassword}</Text>
                </View>
              )}
            </View>

            {message && (
              <Text className='text-sm text-center mt-4'>{message}</Text>
            )}
          </CardContent>
        </Card>

        <View className="gap-4">
          <Text className="text-2xl font-bold mb-2 mt-6">Feed</Text>
          {samplePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}