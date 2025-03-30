import React from 'react';
import { View, Text, Button } from 'react-native';

export default function PostConfirmationScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-lg font-bold">Post Title</Text>
        <Text>Posted {new Date().toLocaleTimeString()}</Text>
      </View>
      <View className="flex justify-between p-4">
        <Button title="Cancel" onPress={() => console.log('Cancel pressed')} />
        <Button title="OK" onPress={() => console.log('OK pressed')} />
      </View>
    </View>
  );
}
