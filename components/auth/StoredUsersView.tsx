import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Ionicons } from '@expo/vector-icons';

interface StoredUsersViewProps {
  users: string[];
  onQuickLogin: (username: string) => Promise<void>;
  isDarkColorScheme: boolean;
}

export function StoredUsersView({ users, onQuickLogin, isDarkColorScheme }: StoredUsersViewProps) {
  return (
    <View className="w-full max-w-sm">
      <ScrollView 
        className="max-h-[200px]"
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        {users
          .filter(user => user !== "SPECTATOR")
          .map((user) => (
            <Button
              key={user}
              onPress={() => onQuickLogin(user)}
              variant="ghost"
              className="px-6 py-3 mb-2 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons 
                  name="person-circle-outline" 
                  size={24} 
                  color={isDarkColorScheme ? '#ffffff' : '#000000'} 
                />
                <Text className="text-lg font-medium text-foreground ml-2">
                  {'@' + user}
                </Text>
              </View>
              <Ionicons 
                name="arrow-forward-outline" 
                size={20} 
                color={isDarkColorScheme ? '#ffffff80' : '#00000080'} 
              />
            </Button>
        ))}
      </ScrollView>
    </View>
  );
}