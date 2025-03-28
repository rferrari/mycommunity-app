import { API_BASE_URL } from './constants';
import type { Post } from './types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Fetches the main feed, filtering duplicate votes to keep only the latest vote per user
 */
export async function getFeed(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/feed`);
    const data: ApiResponse<Post[]> = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      // Process each post to filter duplicate votes
      return data.data.map((post: Post) => {
        if (post.votes && Array.isArray(post.votes)) {
          // Create a map to store the latest vote for each voter
          const latestVotesMap = new Map();
          
          // Iterate through votes to find the latest one for each voter
          post.votes.forEach(vote => {
            const existingVote = latestVotesMap.get(vote.voter);
            if (!existingVote || new Date(vote.timestamp) > new Date(existingVote.timestamp)) {
              latestVotesMap.set(vote.voter, vote);
            }
          });
          
          // Convert the map values back to an array
          post.votes = Array.from(latestVotesMap.values());
        }
        return post;
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
}

/**
 * Fetches the trending feed
 */
export async function getTrending(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/feed/trending`);
    const data: ApiResponse<Post[]> = await response.json();
    return data.success && Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
}

/**
 * Fetches user's balance data
 */
export async function getBalance(username: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/balance/${username}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
}

/**
 * Fetches user's rewards data
 */
export async function getRewards(username: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/balance/${username}/rewards`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return null;
  }
}