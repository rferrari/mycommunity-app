import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import { DimensionValue, Image, Pressable, View } from 'react-native';
import { API_BASE_URL } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '../ui/text';
import { MediaPreview } from './MediaPreview';
import type { Media, Post } from './types';
import { extractMediaFromBody } from './types';
// import Markdown from 'react-native-markdown-display';

const MAX_PREVIEW_LENGTH=300;

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const isShortPost = !!post.parent_author;
  
  // Use description from metadata for long posts if available
  const getDisplayText = () => {
    if (isShortPost) {
      return post.body;
    }

    if (!isExpanded) {
      return post.post_json_metadata.description || 
        post.body.slice(0, MAX_PREVIEW_LENGTH) + '...';
    }

    return post.body;
  };

  const displayText = getDisplayText();
  const shouldShowReadMore = !isShortPost && !isExpanded;

  const handleMediaPress = useCallback((media: Media) => {
    setSelectedMedia(media);
    setIsModalVisible(true);
  }, []);

  const handleVote = async () => {
    try {
      setIsVoting(true);
      setVoteError(null);

      // Get stored credentials
      const storedUsername = await SecureStore.getItemAsync('lastLoggedInUser');
      if (!storedUsername) {
        setVoteError('Please login first');
        return;
      }

      const password = await SecureStore.getItemAsync(storedUsername);
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
          voter: storedUsername,
          author: post.author,
          permlink: post.permlink,
          posting_key: password,
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
    } finally {
      setIsVoting(false);
    }
  };

  const media = extractMediaFromBody(post.body);
  // Show all media for short posts or when expanded, otherwise just first image
  const displayMedia = isShortPost || isExpanded ? media : media.slice(0, 1);

  const markdownStyles = {
    body: {
      color: '#333333',
      fontSize: 16,
    },
    heading1: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 12,
    },
    heading2: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    link: {
      color: '#2196F3',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: '#cccccc',
      paddingLeft: 8,
      fontStyle: 'italic',
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'contain',
    },
    code_block: {
      backgroundColor: '#f5f5f5',
      padding: 10,
      borderRadius: 4,
    }
  };

  // Add custom rules for image rendering
  const markdownRules = {
    image: {
      react: (node: any, output: any, state: any) => (
        <View key={state.key} className="w-full my-2">
          <Image
            source={{ uri: node.attributes.src }}
            className="w-full h-[200px]"
            resizeMode="contain"
          />
        </View>
      )
    }
  };

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

      {!isShortPost && post.title && (
        <Text className="px-4 text-xl font-bold mb-2">
          {post.title}
        </Text>
      )}

      {isShortPost || !post.post_json_metadata.format ? (
        <Text className="px-4">{displayText}</Text>
      ) : (
        <View className="px-4">
          {!isExpanded ? (
            <Text>{post.post_json_metadata.description || displayText}</Text>
          ) : (
            <Text>{post.body}</Text>
            // <Markdown 
            //   style={markdownStyles}
            //   rules={markdownRules}
            //   mergeStyle={true}
            // >
            //   {post.body}
            // </Markdown>
          )}
        </View>
      )}

      {displayMedia.length > 0 && (
        <MediaPreview
          media={displayMedia}
          onMediaPress={handleMediaPress}
          selectedMedia={selectedMedia}
          isModalVisible={isModalVisible}
          onCloseModal={() => setIsModalVisible(false)}
        />
      )}

      {shouldShowReadMore && (
        <Pressable 
          onPress={() => setIsExpanded(true)}
          className={`
            mx-4 my-3 px-4 py-2.5 rounded-lg 
            flex-row items-center justify-center gap-2
            ${isDarkColorScheme 
              ? 'bg-zinc-800/80 active:bg-zinc-700/80 border border-zinc-700' 
              : 'bg-zinc-100 active:bg-zinc-200 border border-zinc-200'
            }
          `}
        >
          <Text 
            className={`
              text-sm font-medium
              ${isDarkColorScheme ? 'text-zinc-300' : 'text-zinc-600'}
            `}
          >
            Continue reading
          </Text>
          <FontAwesome
            name="angle-down"
            size={14}
            color={isDarkColorScheme ? '#d4d4d8' : '#52525b'}
          />
        </Pressable>
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
          {voteError && (
            <Text className="text-red-500 text-xs mb-1">{voteError}</Text>
          )}
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
        </View>
      </View>
    </View>
  );
}