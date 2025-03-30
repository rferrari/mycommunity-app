import { useQuery } from '@tanstack/react-query';
import { getFeed, getTrending, getBalance, getRewards } from '../api';
import { API_BASE_URL } from '../constants';
import type { Post } from '../types';

interface ProfileData {
  name: string;
  reputation: string;
  followers: string;
  followings: string;
  total_posts: string;
  posting_metadata: {
    profile: {
      name: string;
      about: string;
      profile_image?: string;
      cover_image?: string;
      location?: string;
    }
  }
}

const SPECTATOR_PROFILE: ProfileData = {
  name: 'SPECTATOR',
  reputation: '0',
  followers: '0',
  followings: '0',
  total_posts: '0',
  posting_metadata: {
    profile: {
      name: 'Spectator Mode',
      about: 'Browse and explore content without logging in.',
      profile_image: '',
      cover_image: '',
      location: '',
    }
  }
};

export function useFeed() {
  return useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
    refetchInterval: 30000, // 30 seconds
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: getTrending,
    refetchInterval: 30000,
  });
}

export function useBalance(username: string | null) {
  return useQuery({
    queryKey: ['balance', username],
    queryFn: () => username ? getBalance(username) : null,
    enabled: !!username && username !== 'SPECTATOR',
  });
}

export function useRewards(username: string | null) {
  return useQuery({
    queryKey: ['rewards', username],
    queryFn: () => username ? getRewards(username) : null,
    enabled: !!username && username !== 'SPECTATOR',
  });
}

export function useProfile(username: string | null) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      if (!username || username === 'SPECTATOR') {
        return SPECTATOR_PROFILE;
      }
      const profileResponse = await fetch(`${API_BASE_URL}/profile/${username}`);
      const profileJson = await profileResponse.json();
      if (profileJson.success) {
        return profileJson.data;
      }
      throw new Error('Failed to fetch profile data');
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}