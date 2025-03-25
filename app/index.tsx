import * as React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { API_BASE_URL } from '~/lib/constants';

export default function Screen() {
  const [feedData, setFeedData] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

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

  return (
    <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      <Card className='w-full max-w-sm p-6 rounded-2xl'>
        <CardHeader>
          <CardTitle className='pb-2 text-center'>API Feed Data</CardTitle>
        </CardHeader>
        <CardContent className='flex-col gap-4'>
          {errorMessage ? (
            <View className='bg-destructive/10 p-4 rounded-lg'>
              <Text className='text-sm text-destructive'>{errorMessage}</Text>
            </View>
          ) : (
            <View className='bg-muted p-4 rounded-lg'>
              <Text className='text-sm'>{feedData || 'No data fetched yet'}</Text>
            </View>
          )}
          <Button 
            variant='outline'
            className='shadow shadow-foreground/5'
            onPress={fetchFeedData}
          >
            <Text>Fetch Data</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
