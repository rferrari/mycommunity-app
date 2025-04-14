import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../constants';

interface MarketData {
    timestamp: string;
    open: string;
    high: string;
    low: string;
    close: string;
    base_vol: string;
    quote_vol: string;
}

export function useMarket() {
    return useQuery<MarketData>({
        queryKey: ['market'],
        queryFn: async () => {
            const response = await authFetch(`${API_BASE_URL}/market`);
            if (!response.ok) {
                throw new Error('Failed to fetch market data');
            }
            const json = await response.json();
            return json.data as MarketData;
        },
        staleTime: 1000 * 60, // Cache for 1 minute
    });
}