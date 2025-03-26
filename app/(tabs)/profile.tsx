import React, { useState } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [foundPassword, setFoundPassword] = useState('');

  const saveCredentials = async () => {
    try {
      if (!username || !password) {
        setMessage('Please enter both username and password');
        return;
      }

      await SecureStore.setItemAsync(username, password);
      // Store the last logged in user
      await SecureStore.setItemAsync('lastLoggedInUser', username);
      setMessage('Credentials saved successfully!');
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage('Error saving credentials');
      console.error(error);
    }
  };

  const retrievePassword = async () => {
    try {
      if (!searchUsername) {
        setMessage('Please enter a username to search');
        return;
      }

      const storedPassword = await SecureStore.getItemAsync(searchUsername);
      if (storedPassword) {
        setFoundPassword(storedPassword);
        setMessage('Password retrieved successfully!');
      } else {
        setFoundPassword('');
        setMessage('No password found for this username');
      }
    } catch (error) {
      setMessage('Error retrieving password');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear any stored credentials if needed
      await SecureStore.deleteItemAsync('lastLoggedInUser');
      // Navigate back to landing page
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage('Error logging out');
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Card className="w-full max-w-sm rounded-2xl mx-auto">
            <CardHeader>
              <CardTitle className='py-2 text-center'>Profile</CardTitle>
            </CardHeader>
            <CardContent className='gap-4'>
              <View className='gap-4'>
                <Text className='text-base font-medium'>Save Credentials</Text>
                <TextInput
                  className='w-full p-2 border border-input rounded-lg bg-background text-foreground'
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholderTextColor={isDarkColorScheme ? '#666' : '#999'}
                />
                <TextInput
                  className='w-full p-2 border border-input rounded-lg bg-background text-foreground'
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={isDarkColorScheme ? '#666' : '#999'}
                />
                <Button onPress={saveCredentials}>
                  <Text>Save Credentials</Text>
                </Button>
              </View>
              <View className='gap-4 mt-4'>
                <Text className='text-base font-medium'>Retrieve Password</Text>
                <TextInput
                  className='w-full p-2 border border-input rounded-lg bg-background text-foreground'
                  placeholder="Enter username to search"
                  value={searchUsername}
                  onChangeText={setSearchUsername}
                  placeholderTextColor={isDarkColorScheme ? '#666' : '#999'}
                />
                <Button onPress={retrievePassword}>
                  <Text>Find Password</Text>
                </Button>
                {foundPassword && (
                  <View className='p-2 bg-muted rounded-lg'>
                    <Text>Found Password: {foundPassword}</Text>
                  </View>
                )}
              </View>
              <View className='mt-8'>
                <Button 
                  variant="destructive" 
                  onPress={handleLogout}
                  className="bg-red-600"
                >
                  <Text className="text-white">Logout</Text>
                </Button>
              </View>
              {message && (
                <Text className='text-sm text-center mt-4'>{message}</Text>
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}