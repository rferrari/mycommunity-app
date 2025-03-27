import { useFocusEffect } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { Button } from '~/components/ui/button';
import { Feed } from '~/components/Feed';
import React from 'react';
import { router } from 'expo-router';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  return (
    <View className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-xl font-bold text-foreground">Welcome to SkateHive!</Text>
        <Text className="text-sm text-foreground/80 mt-1">
          SkateHive is a decentralized skateboarding community where skaters share clips, earn crypto, and connect with the scene.
        </Text>
        <Text className="text-sm text-foreground/80 mt-1">
          SkateHive is a decentralized skateboarding community where skaters share clips, earn crypto, and connect with the scene.
        </Text>
        <Text className="text-sm text-foreground/80 mt-1">
          SkateHive is a decentralized skateboarding community where skaters share clips, earn crypto, and connect with the scene.
        </Text>
        <View className="pt-6 space-y-4">
          <Button
            onPress={() => router.push('/(onboarding)/profile')}
            className="bg-foreground w-full"
          >
            <Text className="text-xl font-bold text-background">
              Next
            </Text>
          </Button>

          <Button
            onPress={() => router.back()}
            className="bg-foreground/10 w-full"
          >
            <Text className="text-xl font-bold text-foreground">
              Back
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}