import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface LoginFormProps {
  username: string;
  password: string;
  message: string;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => Promise<void>;
  isDarkColorScheme: boolean;
}

export function LoginForm({ 
  username, 
  password, 
  message, 
  onUsernameChange, 
  onPasswordChange, 
  onSubmit,
  isDarkColorScheme 
}: LoginFormProps) {
  return (
    <View className="w-full max-w-sm space-y-6">
      <Text className="text-4xl font-bold text-center text-foreground mb-8">
        Login
      </Text>
      <Input
        placeholder="Hive Username"
        value={username}
        onChangeText={onUsernameChange}
        className="bg-foreground/10 px-4 py-3 rounded-lg text-foreground"
        placeholderTextColor={isDarkColorScheme ? '#ffffff80' : '#00000080'}
        autoCapitalize="none"
      />
      <Input
        placeholder="Posting Key"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        className="bg-foreground/10 px-4 py-3 rounded-lg text-foreground"
        placeholderTextColor={isDarkColorScheme ? '#ffffff80' : '#00000080'}
      />
      {message && (
        <Text className="text-sm text-center text-foreground/80">
          {message}
        </Text>
      )}
      <Button
        onPress={onSubmit}
        variant="default"
        size="xl"
      >
        <Text className="text-xl font-bold text-center text-background">
          Submit
        </Text>
      </Button>
    </View>
  );
}