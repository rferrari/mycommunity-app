import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Feed } from '~/components/Feed';

export default function Screen() {
  return (
    <ScrollView className='flex-1 bg-background'>
      <View className='w-full p-4'>
        <Feed />
      </View>
    </ScrollView>
  );
}
