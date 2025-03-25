import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Feed } from '~/components/Feed';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return (
    <SafeAreaView edges={['bottom']} className='flex-1'>
      <ScrollView className='flex-1'>
        <View className='justify-center items-center gap-5 p-6 bg-secondary/30'>
          <View className='w-full max-w-sm'>
            <Feed />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
