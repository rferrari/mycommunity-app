import React, { useCallback, useState, useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '../ui/card';
import { Text } from '../ui/text';
import { MediaPreview } from './MediaPreview';
import { CssTextProvider } from '../ui/CssTextProvider';
import type { Post, Media } from './types';
import { extractMediaFromBody } from './types';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '~/lib/constants';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false); // Initialize as false, will update in useEffect

  // Update like state whenever post or currentUser changes
  useEffect(() => {
    console.log('Current user:', currentUser);
    if (!currentUser || !post.votes) return;
    const hasUserVoted = post.votes.some(vote => vote.voter === currentUser);
    if (hasUserVoted !== isLiked) {
      setIsLiked(hasUserVoted);
    }
  }, [post.votes, currentUser, isLiked]);

  useEffect(() => {
    async function init() {
      const username = await SecureStore.getItemAsync('lastLoggedInUser');
      setCurrentUser(username);
      if (username && post.votes) {
        const hasUserVoted = post.votes.some(vote => vote.voter === username);
        setIsLiked(hasUserVoted);
      }
    }
    init();
  }, [post.votes]);

  const handleMediaPress = useCallback((media: Media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  }, []);

  const handleVote = async () => {
    try {
      setIsVoting(true);
      setVoteError(null);
      
      if (!currentUser) {
        setVoteError('Please login first');
        return;
      }

      const password = await SecureStore.getItemAsync(currentUser);
      if (!password) {
        setVoteError('Invalid credentials');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voter: currentUser,
          author: post.author,
          permlink: post.permlink,
          posting_key: password,
          weight: isLiked ? 0 : 10000
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
    } finally {
      setIsVoting(false);
    }
  };

  const media = extractMediaFromBody(post.body);
  const voteCount = post.votes ? post.votes.length : 0;
  const payoutValue = parseFloat(post.pending_payout_value || '0');

  return (
    <CssTextProvider>
      <Card className="w-full mb-4">
        <CardContent>
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-row items-center">
              <View className="h-10 w-10 mr-3 rounded-full overflow-hidden">
                <Image
                  source={{ uri: `https://images.ecency.com/webp/u/${post.author}/avatar/small` }}
                  className="w-full h-full"
                  accessibilityLabel={`${post.author}'s avatar`}
                />
              </View>
              <View>
                <Text className="font-bold text-lg">{post.author}</Text>
                {post.user_json_metadata?.extensions?.level && (
                  <Text className="text-gray-500">
                    Level {post.user_json_metadata.extensions.level}
                  </Text>
                )}
              </View>
            </View>
            <Text className="text-gray-500 mt-1">
              {formatDistanceToNow(new Date(post.created), { addSuffix: true })}
            </Text>
          </View>

          <View className="mb-3">
            <Text>
              {post.body.replace(/<iframe.*?<\/iframe>|!\[.*?\]\(.*?\)/g, '')}
            </Text>
          </View>

          {media.length > 0 && (
            <MediaPreview
              media={media}
              onMediaPress={handleMediaPress}
              selectedMedia={selectedMedia}
              isModalVisible={isModalVisible}
              onCloseModal={() => setIsModalVisible(false)}
            />
          )}

          <View className="flex-row justify-between items-center mt-3">
            <View>
              <Text className="text-gray-500 font-bold">
                ${payoutValue.toFixed(3)} {post.pending_payout_value ? 'Pending' : ''}
              </Text>
            </View>
            <View>
              {voteError && (
                <Text className="text-red-500 text-xs mb-1">{voteError}</Text>
              )}
              <Pressable
                onPress={handleVote}
                className="flex-row items-center"
                disabled={isVoting || !post.allow_votes}
                accessibilityRole="button"
                accessibilityLabel={isLiked ? "Unlike post" : "Like post"}
              >
                <View className="flex-row items-center">
                  <FontAwesome
                    name={isLiked ? "heart" : "heart-o"}
                    size={20}
                    color={isLiked ? "#ff4444" : "#666666"}
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-gray-600">
                    {isVoting ? 'Voting...' : voteCount.toString()}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </CardContent>
      </Card>
    </CssTextProvider>
  );
}