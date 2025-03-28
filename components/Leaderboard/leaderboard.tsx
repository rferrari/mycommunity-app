import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { API_BASE_URL } from '~/lib/constants';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

interface LeaderboardProps {
    // currentUsername: string | null;
}

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

export function Leaderboard(
    // { currentUsername }: LeaderboardProps
) {
    const [skaters, setSkaters] = useState<LeaderboardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSkaters = async () => {
            try {
                const response = await fetch(`http://192.168.0.14:3000/api/skatehive`);
                const data = await response.json();
                const sortedData = data.sort((
                    a:LeaderboardData, 
                    b:LeaderboardData) => b.points - a.points);

                 // Show top 10 results
                const top10Results = sortedData.slice(0, 10);
                setSkaters(top10Results);
                setIsLoading(false);
            } catch (error) {
                setError("Error fetching skatehive api data");
                console.log(error)
                setIsLoading(false);
            }
        };
        fetchSkaters();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 20, paddingTop: 0 }}>
                <Text>Leaderboard</Text>
                <ScrollView>
                    {skaters.map((skater, index) => (
                        <View key={skater.id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{ fontWeight: 'bold' }}>{index + 1}. {skater.hive_author}</Text>
                            <Text>Score: {skater.points}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}