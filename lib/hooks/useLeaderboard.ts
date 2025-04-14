import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../constants';

interface LeaderboardData {
    id: number;
    hive_author: string;
    hive_balance: number;
    hp_balance: number;
    hbd_balance: number;
    hbd_savings_balance: number;
    has_voted_in_witness: boolean;
    eth_address: string;
    gnars_balance: number;
    gnars_votes: number;
    skatehive_nft_balance: number;
    max_voting_power_usd: number;
    last_updated: string;
    last_post: string;
    post_count: number;
    points: number;
    giveth_donations_usd: number;
    giveth_donations_amount: number;
  }
  
  export function useLeaderboard() {
    return useQuery({
      queryKey: ['leaderboard'],
      queryFn: async () => {
        const response = await authFetch(`${API_BASE_URL}/leaderboard`);
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data: LeaderboardData[] = await response.json();
        return data.sort((a, b) => b.points - a.points);
      },
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
  }