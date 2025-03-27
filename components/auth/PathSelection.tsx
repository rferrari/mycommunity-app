import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { StoredUsersView } from './StoredUsersView';

interface PathSelectionProps {
  storedUsers: string[];
  onLogin: () => void;
  onSpectator: () => Promise<void>;
  onQuickLogin: (username: string) => Promise<void>;
  isDarkColorScheme: boolean;
}

export function PathSelection({ 
  storedUsers, 
  onLogin, 
  onSpectator, 
  onQuickLogin,
  isDarkColorScheme 
}: PathSelectionProps) {
  return (
    <View className="w-full max-w-sm space-y-8">
      <Text className="text-4xl font-bold text-center text-foreground mb-8">
        Choose Your Path
      </Text>
      
      {storedUsers.length > 0 && (
        <View className="mb-8">
          <StoredUsersView 
            users={storedUsers} 
            onQuickLogin={onQuickLogin}
            isDarkColorScheme={isDarkColorScheme}
          />
        </View>
      )}

      <View className="space-y-4">
        <Button
          onPress={onLogin}
          variant="default"
          size="xl"
        >
          <Text className="text-xl font-bold text-center text-background">
            New Login
          </Text>
        </Button>
        <Button
          onPress={onSpectator}
          variant="ghost"
          size="xl"
        >
          <Text className="text-xl font-bold text-center text-foreground">
            Enter as Spectator
          </Text>
        </Button>
      </View>
    </View>
  );
}