import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';
import { API_BASE_URL } from '~/lib/constants';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function CreatePostSchedulerPage() {
  const { isDarkColorScheme } = useColorScheme();
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // 24 hours from now
  // const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const today = new Date();
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const day = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    days.push(`${day.toLocaleDateString('en-US', { weekday: 'short' })} ${day.getDate()}`);
  }


  // const handleCloseWallet = () => {
  //   router.push('/(tabs)/feed');
  // };

  const handleContinue = () => {
    router.push('/(createpost)/createPost');
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <View className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-1 p-4">
            <Text className="text-lg font-bold">Scheduler</Text>
            <Text>Select Day:</Text>
            <View className="flex-row flex-wrap justify-center">
              {days.map((day, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedDay(day)}>
                  <Text style={{ fontSize: 18, padding: 10, backgroundColor: selectedDay === day ? 'gray' : 'black', borderRadius: 10, color: isDarkColorScheme ? 'white' : 'black' }}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text>Select Hour:</Text>
            <View className="flex-row flex-wrap justify-center">
              {Array(24).fill(0).map((_, hour) => (
                <TouchableOpacity key={hour} onPress={() => setStartTime(new Date(startTime.setHours(hour)))}>
                  <Text style={{ fontSize: 18, padding: 10, backgroundColor: startTime.getHours() === hour ? 'gray' : 'black', borderRadius: 10, color: isDarkColorScheme ? 'white' : 'black' }}>
                    {hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text>Select Minute:</Text>
            <View className="flex-row flex-wrap justify-center">
              {Array(12).fill(0).map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setStartTime(new Date(startTime.setMinutes(i * 5)))}>
                  <Text style={{ fontSize: 18, padding: 10, backgroundColor: startTime.getMinutes() === i * 5 ? 'gray' : 'black', borderRadius: 10, color: isDarkColorScheme ? 'white' : 'black' }}>
                    {i * 5 < 10 ? `0${i * 5}` : i * 5}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Add time picker component here to update startTime state */}

            <Pressable onPress={handleContinue}>
              <Ionicons
                name={"play-outline"}
                size={24}
                color={isDarkColorScheme ? '#ffffff' : '#000000'}
              />
              <Text>Continue</Text>
            </Pressable>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
