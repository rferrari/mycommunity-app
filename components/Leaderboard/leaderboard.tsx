import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { API_BASE_URL, API_BASE____ } from '~/lib/constants';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../ui/LoadingScreen';

interface LeaderboardProps {
    currentUsername: string | null;
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
    { currentUsername }: LeaderboardProps
) {
    const [skaters, setSkaters] = useState<LeaderboardData[]>([]);

    const [currentUserPosition, setCurrentUserPosition] = useState<string>("1000");
    const [currentUserName, setCurrentUserName] = useState<string | null>("");
    const [currentUserScore, setCurrentUserScore] = useState<string | null>("");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSkaters = async () => {
            try {
                const response = await fetch(`${API_BASE____}/skatehive`);
                const data = await response.json();
                const sortedData = data.sort((
                    a: LeaderboardData,
                    b: LeaderboardData) => b.points - a.points);

                // Find the current user's position in the leaderboard
                const currentUserIndex = sortedData.findIndex((user: LeaderboardData) => user.hive_author === currentUsername);


                // Show top 10 results
                let top10Results = sortedData.slice(0, 10);

                // Add the current user's position to the top 10 results at the 11th position
                if (currentUserIndex > 10) {
                    // top10Results.push(sortedData[currentUserIndex]);
                    setCurrentUserPosition(currentUserIndex + 1); // Add 1 because indices are 0-based
                    setCurrentUserName(currentUsername)
                    setCurrentUserScore("1000")
                }

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
                <LoadingScreen/>
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
            <View className="px-6 mt-4">
                <View className="space-y-3">
                    <View className="flex-row items-center">
                        <Text className="text-xl font-bold">Leaderboard</Text>
                    </View>
                    <View className="flex-row justify-between">

                        <ScrollView >
                            {skaters.map((skater, index) => (
                                <View key={skater.id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{index + 1}.  {skater.hive_author}</Text>
                                    <Text>Score: {skater.points}</Text>
                                </View>
                            ))}

                            <Text style={{ fontWeight: 'bold' }}>{currentUserPosition}.  {currentUsername}</Text>
                            <Text>Score: {currentUserScore}</Text>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}