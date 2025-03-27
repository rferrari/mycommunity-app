import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { Trending } from '~/components/Trending';
import React from 'react';

export default function TrendingPage() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  return (
    <View className="flex-1 bg-background">
      <Trending refreshTrigger={refreshKey} />
    </View>
  );
}