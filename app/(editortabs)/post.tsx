import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { SkateFeed } from '~/components/SkateFeed';
import React from 'react';

export default function SkateFeedPage() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      // Increment the refresh key when the tab is focused
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  return (
    <View className="flex-1 bg-background">
      <SkateFeed refreshTrigger={refreshKey} />
    </View>
  );
}
