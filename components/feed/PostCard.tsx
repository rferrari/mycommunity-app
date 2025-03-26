import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { API_BASE_URL } from '~/lib/constants';
import { Text } from '../ui/text';
import { MediaPreview } from './MediaPreview';
import { Toast } from '../ui/toast';
import type { Media, Post } from './types';
import { extractMediaFromBody } from './types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleMediaPress = useCallback((media: Media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  }, []);

  const handleVote = async () => {
    try {
      setIsVoting(true);
      setVoteError(null);

      const currentUser = await SecureStore.getItemAsync('lastLoggedInUser');
      
      // Check if user is in spectator mode (no user logged in)
      if (!currentUser) {
        setVoteError('Please login to vote');
        setShowToast(true);
        return;
      }

      const userCredentials = await SecureStore.getItemAsync(currentUser);
      if (!userCredentials) {
        setVoteError('Invalid credentials');
        setShowToast(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voter: currentUser,
          author: post.author,
          permlink: post.permlink,
          posting_key: userCredentials,
          weight: isLiked ? 0 : 10000 // Toggle between like and unlike
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Vote error:', error);
      setVoteError(error instanceof Error ? error.message : 'Failed to vote');
      setShowToast(true);
    } finally {
      setIsVoting(false);
    }
  };

  // Optional: Add visual indication for spectator mode
  const renderVoteButton = () => (
    <Pressable
      onPress={handleVote}
      className="flex-row items-center gap-2"
      disabled={isVoting}
    >
      <Text className="text-gray-600">
        {post.votes.length}
      </Text>
      <FontAwesome
        name={isLiked ? "heart" : "heart-o"}
        size={20}
        color={isLiked ? "#ff4444" : "#666666"}
        style={{ marginRight: 4 }}
      />
    </Pressable>
  );

  const media = extractMediaFromBody(post.body);

  return (
    <View className="w-full mb-4">
      {showToast && voteError && (
        <Toast 
          message={voteError} 
          type="error" 
          onHide={() => setShowToast(false)}
        />
      )}

      <View className="flex-row items-center justify-between mb-3 px-2">
        <View className="flex-row items-center">
          <View className="h-12 w-12 mr-3 rounded-full overflow-hidden">
            <Image
              source={{ uri: `https://images.ecency.com/webp/u/${post.author}/avatar/small` }}
              className="w-full h-full border border-muted rounded-full"
              alt={`${post.author}'s avatar`}
            />
          </View>
          <View>
            <Text className="font-bold text-lg">@{post.author}</Text>
          </View>
        </View>
        <Text className="text-gray-500">
          {formatDistanceToNow(new Date(post.created), { addSuffix: true })}
        </Text>
      </View>

      <Text className="px-4">{post.body.replace(/<iframe.*?<\/iframe>|!\[.*?\]\(.*?\)/g, '')}</Text>

      {media.length > 0 && (
        <MediaPreview
          media={media}
          onMediaPress={handleMediaPress}
          selectedMedia={selectedMedia}
          isModalVisible={isModalVisible}
          onCloseModal={() => setIsModalVisible(false)}
        />
      )}

      <View className="flex-row justify-between items-center mx-2">
        {parseInt(post.total_payout_value) === 0 ? (
          <Text className="text-gray-500 font-bold">
            ${post.total_payout_value}
          </Text>
        ) : (
          <Text className="text-gray-500 font-bold">
            ${parseFloat(post.total_payout_value).toFixed(3)}
          </Text>
        )}
        <View>
          {renderVoteButton()}
        </View>
      </View>
    </View>
  );
}