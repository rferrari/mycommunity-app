import { useQuery } from '@tanstack/react-query';
import { getBalance, getRewards } from '../api';
import { API_BASE_URL } from '../constants';

interface ProfileData {
    name: string;
    reputation: string;
    followers: string;
    followings: string;
    community_followers: string;
    community_followings: string;
    community_totalposts: string;
    vp_percent: string;
    rc_percent: string;
    hp_equivalent: string;
    total_posts: string;
    posting_metadata?: {
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
    community_followers: '0',
    community_followings: '0',
    vp_percent: '0',
    rc_percent: '0',
    hp_equivalent: '0',
    total_posts: '0',
    community_totalposts: '0',
    posting_metadata: {
      profile: {
        name: 'Spectator',
        about: '',
        profile_image: '',
        cover_image: '',
        location: '',
      }
    }
  };


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
    return useQuery<ProfileData, Error>({
      queryKey: ['profile', username],
      queryFn: async (): Promise<ProfileData> => {
        if (!username || username === 'SPECTATOR') {
          return SPECTATOR_PROFILE;
        }
        const profileResponse = await authFetch(`${API_BASE_URL}/profile/${username}`);
        const profileJson = await profileResponse.json();
        if (profileJson.success) {
          return profileJson.data as ProfileData;
        }
        throw new Error('Failed to fetch profile data');
      },
      enabled: !!username,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  }