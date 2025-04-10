import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Feed } from "~/components/Feed/Feed";

export default function FeedPage() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  return (
    <View className="flex-1 bg-background" style={{ overflow: 'visible' }}>
      <Feed refreshTrigger={refreshKey} />
    </View>
  );
}
