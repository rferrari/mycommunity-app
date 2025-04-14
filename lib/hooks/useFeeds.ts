import { useQuery } from '@tanstack/react-query';
import {
    getFeed,
    getTrending,
    getFollowing
} from '../api';
import { API_BASE_URL } from '../constants';



export function useFeed() {
    return useQuery({
        queryKey: ['feed'],
        queryFn: getFeed,
        refetchInterval: 60000,
    });
}

export function useTrending() {
    return useQuery({
        queryKey: ['trending'],
        queryFn: getTrending,
        refetchInterval: 60000,
    });
}

export function useFollowing(username: string) {
    return useQuery({
        queryKey: ['following'],
        queryFn: () => getFollowing(username),
        refetchInterval: 60000,
    });
}


export function useUserFeed(username: string | null) {
    return useQuery({
        queryKey: ['userFeed', username],
        queryFn: async () => {
            if (!username || username === 'SPECTATOR') {
                return [];
            }
            const response = await authFetch(`${API_BASE_URL}/feed/${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user feed');
            }
            const data = await response.json();
            return data.success ? data.data : [];
        },
        enabled: !!username && username !== 'SPECTATOR',
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
}