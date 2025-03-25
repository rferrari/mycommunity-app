import { View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

export default function ProfileScreen() {
  return (
    <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      <Card className='w-full max-w-sm rounded-2xl'>
        <CardHeader>
          <CardTitle className='py-2 text-center'>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className='text-sm text-center'>Your profile information will appear here</Text>
        </CardContent>
      </Card>
    </View>
  );
}