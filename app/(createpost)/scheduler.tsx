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

export default function CreatePostSchedulerPage() {

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <View className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-1 p-4">
            <Text className="text-lg font-bold">Scheduler</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}