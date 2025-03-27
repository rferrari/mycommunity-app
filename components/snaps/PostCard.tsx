import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState, useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';
import { API_BASE_URL } from '~/lib/constants';
import { Text } from '../ui/text';
import { MediaPreview } from './MediaPreview';
import type { Media, Post } from './types';
import { extractMediaFromBody } from './types';

interface PostCardProps {
  post: Post;
  currentUsername: string | null;
}

export function PostCard({ post, currentUsername }: PostCardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // Check if user has already voted on this post
  useEffect(() => {
    if (currentUsername && post.votes) {
      const hasVoted = post.votes.some(vote => vote.voter === currentUsername && vote.weight > 0);
      setIsLiked(hasVoted);
    }
  }, [post.votes, currentUsername]);

  const handleMediaPress = useCallback((media: Media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  }, []);

  const handleVote = async () => {
    try {
      setIsVoting(true);
      setVoteError(null);

      if (!currentUsername) {
        setVoteError('Please login first');
        return;
      }

      const password = await SecureStore.getItemAsync(currentUsername);
      if (!password) {
        setVoteError('Invalid credentials');
        return;
      }

      // Optimistically update the UI
      const previousLikedState = isLiked;
      setIsLiked(!isLiked);

      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voter: currentUsername,
          author: post.author,
          permlink: post.permlink,
          posting_key: password,
          weight: previousLikedState ? 0 : 10000 // Use previous state to determine weight
        })
      });

      if (!response.ok) {
        const error = await response.text();
        // Revert the optimistic update if the request failed
        setIsLiked(previousLikedState);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Vote error:', error);
      setVoteError(error instanceof Error ? error.message : 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  const media = extractMediaFromBody(post.body);
  const postContent = post.body.replace(/<iframe.*?<\/iframe>|!\[.*?\]\(.*?\)/g, '').trim();

  return (
    <View className="w-full mb-4">
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

      {postContent !== '' && (
        <Text className="px-2 mb-2">{postContent}</Text>
      )}

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
        {parseFloat(post.total_payout_value) === 0 ? (
          <Text className="text-gray-500 font-bold text-xl">
            ${post.total_payout_value}
          </Text>
        ) : (
          <Text className="text-green-500 font-bold text-xl">
            ${parseFloat(post.total_payout_value).toFixed(3)}
          </Text>
        )}
        <View>
          {voteError && (
            <Text className="text-red-500 text-xs mb-1">{voteError}</Text>
          )}
          <Pressable
            onPress={handleVote}
            className="flex-row items-center gap-2"
            disabled={isVoting}
          >
            <Text className="text-gray-600 text-xl">
              {post.votes.length}
            </Text>
            <FontAwesome
              name={isLiked ? "heart" : "heart-o"}
              size={20}
              color={isLiked ? "#ff4444" : "#666666"}
              style={{ marginRight: 4 }}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}