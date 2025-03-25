import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React, { useCallback, useState } from 'react';
import { Image, Modal, Pressable, View } from 'react-native';
import { Card, CardContent } from './ui/card';
import { Text } from './ui/text';
import { API_BASE_URL } from '~/lib/constants';

interface Post {
  title: string;
  body: string;
  author: string;
  permlink: string;
  created: string;
  last_edited: string | null;
  cashout_time: string;
  last_payout: string;
  tags: string[];
  json_metadata: {
    app: string;
    tags: string[];
    image?: string;
  };
  pending_payout_value: string;
  author_rewards: string;
  author_rewards_in_hive: string;
  total_payout_value: string;
  curator_payout_value: string;
  total_vote_weight: number;
  allow_votes: boolean;
  deleted: boolean;
}

function extractMediaFromBody(body: string): { type: 'image' | 'video'; url: string }[] {
  const media: { type: 'image' | 'video'; url: string }[] = [];

  // Extract images
  const imageMatches = body.match(/!\[.*?\]\((.*?)\)/g);
  if (imageMatches) {
    imageMatches.forEach(match => {
      const url = match.match(/\((.*?)\)/)?.[1];
      if (url) media.push({ type: 'image', url });
    });
  }

  // Extract videos from iframes with IPFS links
  const iframeMatches = body.match(/<iframe.*?src="(.*?)".*?><\/iframe>/g);
  if (iframeMatches) {
    iframeMatches.forEach(match => {
      const url = match.match(/src="(.*?)"/)?.[1];
      if (url && url.includes('ipfs.skatehive.app')) {
        media.push({ type: 'video', url });
      }
    });
  }

  return media;
}

const VideoPlayerComponent = React.memo(({ url, onToggleMute }: { 
  url: string; 
  onToggleMute: () => void;
}) => {
  const player = useVideoPlayer(url, player => {
    player.loop = true;
    player.muted = true;
    player.play(); // Auto-play the video since we removed the play button
  });
  
  const { muted } = useEvent(player, 'mutedChange', { muted: player.muted });

  const handleMutePress = () => {
    player.muted = !player.muted;
    onToggleMute();
  };

  return (
    <>
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
      />
      <View className="absolute bottom-2 right-2">
        <Pressable
          className="bg-black/50 p-2.5 rounded-full w-10 h-10 items-center justify-center"
          onPress={handleMutePress}
        >
          <FontAwesome
            name={muted ? "volume-off" : "volume-up"}
            size={20}
            color="white"
          />
        </Pressable>
      </View>
    </>
  );
});

function PostCard({ post }: { post: Post }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video'; url: string } | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [playerStates, setPlayerStates] = useState<{[key: string]: { isPlaying: boolean; isMuted: boolean }}>({});

  const handleMediaPress = useCallback((media: { type: 'image' | 'video'; url: string }) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  }, []);

  const togglePlayStatus = useCallback((url: string) => {
    setPlayerStates(prev => ({
      ...prev,
      [url]: { ...prev[url], isPlaying: !prev[url]?.isPlaying }
    }));
  }, []);

  const toggleMute = useCallback((url: string) => {
    setPlayerStates(prev => ({
      ...prev,
      [url]: { ...prev[url], isMuted: !prev[url]?.isMuted }
    }));
  }, []);

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

        {post.body && (
          <View className="flex-row flex-wrap gap-1 mb-3">
            {extractMediaFromBody(post.body).map((media, index) => (
              <Pressable
                key={index}
                onPress={() => handleMediaPress(media)}
                className={`${extractMediaFromBody(post.body).length === 1 ? 'w-full' : 'w-[49%]'} aspect-square rounded-lg overflow-hidden relative bg-gray-100`}
              >
                {media.type === 'image' ? (
                  <Image
                    source={{ uri: media.url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full">
                    <VideoPlayerComponent
                      url={media.url}
                      onToggleMute={() => toggleMute(media.url)}
                    />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
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
            {selectedMedia?.type === 'image' ? (
              <Image
                source={{ uri: selectedMedia.url }}
                className="w-full h-full"
                resizeMode="contain"
              />
            ) : selectedMedia?.type === 'video' ? (
              <VideoPlayerComponent
                url={selectedMedia.url}
                onToggleMute={() => toggleMute(selectedMedia.url)}
              />
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </Card>
  );
}

export function Feed() {
  const [feedData, setFeedData] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/feed`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setFeedData(data.data);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (isLoading) {
    return (
      <View className="w-full items-center justify-center p-4">
        <Text>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View className="w-full gap-4">
      <Text className="text-2xl font-bold mb-2">Latest Posts</Text>
      {feedData.map((post) => (
        <PostCard key={post.permlink} post={post} />
      ))}
    </View>
  );
}