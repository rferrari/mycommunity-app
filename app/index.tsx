import * as React from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { API_BASE_URL } from '~/lib/constants';
import * as SecureStore from 'expo-secure-store';

export default function Screen() {
  const [feedData, setFeedData] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [username, setUsername] = React.useState('');
  const [authData, setAuthData] = React.useState<string>('');
  const [authError, setAuthError] = React.useState<string>('');

  async function fetchFeedData() {
    // Clear previous states
    setErrorMessage('');
    setFeedData('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/feed`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFeedData(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error fetching feed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while fetching data');
      setFeedData('');
    }
  }

  async function fetchAuthenticatedData() {
    setAuthError('');
    setAuthData('');
    
    try {
      if (!username) {
        setAuthError('Please enter a username');
        return;
      }

      const password = await SecureStore.getItemAsync(username);
      if (!password) {
        setAuthError('No stored credentials found for this username');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth-feed`, {
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAuthData(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error fetching authenticated data:', error);
      setAuthError(error instanceof Error ? error.message : 'An error occurred while fetching data');
      setAuthData('');
    }
  }

  return (
    <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      {/* Public API Card */}
      <Card className='w-full max-w-sm rounded-2xl'>
        <CardHeader>
          <CardTitle className='py-2 text-center'>Public API Feed</CardTitle>
        </CardHeader>
        <CardContent className='flex-col gap-4'>
          {errorMessage ? (
            <View className='bg-destructive/10 p-4 rounded-lg'>
              <Text className='text-sm text-destructive'>{errorMessage}</Text>
            </View>
          ) : (
            <View className='bg-muted p-4 rounded-lg'>
              <ScrollView className='max-h-32' showsVerticalScrollIndicator={true}>
                <Text className='text-sm'>{feedData || 'No data fetched yet'}</Text>
              </ScrollView>
            </View>
          )}
          <Button 
            variant='outline'
            className='shadow shadow-foreground/5'
            onPress={fetchFeedData}
          >
            <Text>Fetch Public Data</Text>
          </Button>
        </CardContent>
      </Card>

      {/* Authenticated API Card */}
      <Card className='w-full max-w-sm rounded-2xl'>
        <CardHeader>
          <CardTitle className='py-2 text-center'>Authenticated API Feed</CardTitle>
        </CardHeader>
        <CardContent className='flex-col gap-4'>
          <TextInput
            className='w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600'
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
          {authError ? (
            <View className='bg-destructive/10 p-4 rounded-lg'>
              <Text className='text-sm text-destructive'>{authError}</Text>
            </View>
          ) : (
            <View className='bg-muted p-4 rounded-lg'>
              <ScrollView className='max-h-32' showsVerticalScrollIndicator={true}>
                <Text className='text-sm'>{authData || 'No authenticated data fetched yet'}</Text>
              </ScrollView>
            </View>
          )}
          <Button 
            variant='outline'
            className='shadow shadow-foreground/5'
            onPress={fetchAuthenticatedData}
          >
            <Text>Fetch Authenticated Data</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
