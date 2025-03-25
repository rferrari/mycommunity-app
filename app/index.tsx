import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Feed } from '~/components/Feed';

export default function Screen() {
  return (
    <ScrollView className='flex-1 bg-background'>
      <View className='justify-center items-center gap-5 p-6'>
        <View className='w-full max-w-sm'>
          <Feed />
        </View>
      </View>
    </ScrollView>
  );
}
