import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { Feed } from '~/components/Feed';
import React from 'react';

export default function FeedPage() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <Feed refreshTrigger={refreshKey} />
      </View>
    </SafeAreaView>
  );
}