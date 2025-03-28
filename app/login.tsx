import React from 'react';
import { View } from 'react-native';
import { AuthScreen } from '~/components/auth/AuthScreen';

export default function LoginPage() {
  return (
    <View className="flex-1">
      <AuthScreen />
    </View>
  );
}