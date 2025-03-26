import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

export default function WaitlistScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage('Thanks for joining our waiting list!');
      setTimeout(() => router.back(), 2000);
    } catch (error) {
      setMessage('Error joining waiting list. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-6 space-y-8">
          {/* Header */}
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="p-2">
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDarkColorScheme ? '#ffffff' : '#000000'} 
              />
            </Pressable>
            <Text className="text-2xl font-bold ml-2">Join Waiting List</Text>
          </View>

          {/* Content */}
          <View className="space-y-6">
            <View className="items-center">
              <Ionicons 
                name="mail-outline" 
                size={64} 
                color={isDarkColorScheme ? '#ffffff' : '#000000'} 
              />
            </View>

            <View className="space-y-2">
              <Text className="text-xl font-bold text-center">
                Be the First to Know
              </Text>
              <Text className="text-center opacity-70">
                Join our waiting list and get early access when we launch new features
              </Text>
            </View>

            <View className="space-y-4">
              <Input
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-foreground/5 px-4 py-3 rounded-lg"
              />

              <Button
                onPress={handleSubmit}
                className="bg-foreground"
                disabled={isSubmitting}
              >
                <Text className="text-background text-lg font-bold">
                  {isSubmitting ? 'Submitting...' : 'Join Now'}
                </Text>
              </Button>
            </View>

            {message && (
              <Text className="text-sm text-center opacity-70">
                {message}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}