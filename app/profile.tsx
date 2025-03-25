import { View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { TextInput } from 'react-native';

export default function ProfileScreen() {
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

  return (
    <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      <Card className='w-full max-w-sm rounded-2xl'>
        <CardHeader>
          <CardTitle className='py-2 text-center'>Profile</CardTitle>
        </CardHeader>
        <CardContent className='gap-4'>
          <View className='gap-4'>
            <Text className='text-base font-medium'>Save Credentials</Text>
            <TextInput
              className='w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600'
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              className='w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600'
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button onPress={saveCredentials}>
              <Text>Save Credentials</Text>
            </Button>
          </View>

          <View className='gap-4 mt-4'>
            <Text className='text-base font-medium'>Retrieve Password</Text>
            <TextInput
              className='w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600'
              placeholder="Enter username to search"
              value={searchUsername}
              onChangeText={setSearchUsername}
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

          {message && (
            <Text className='text-sm text-center mt-4'>{message}</Text>
          )}
        </CardContent>
      </Card>
    </View>
  );
}