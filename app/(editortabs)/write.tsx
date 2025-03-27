import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { Feed } from '~/components/Feed';
import React from 'react';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  return (
    <View className="flex-1 bg-background">
    </View>
  );
}