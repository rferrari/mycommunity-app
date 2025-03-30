import React from 'react';
import { View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { TextInput } from 'react-native';

import { Button } from '~/components/ui/button';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function CreatePostWritePage() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { isDarkColorScheme } = useColorScheme();

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const handleCloseWallet = () => {
    router.push('/(tabs)/feed');
  };


    const handleContinue = () => {
      router.push('/(createpost)/createPost');
    }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={handleCloseWallet}>
              <Ionicons
                name="close-outline"
                size={24}
                color={isDarkColorScheme ? '#ffffff' : '#000000'}
              />
            </Pressable>
            <Pressable
            >
              <Text className="text-xl font-bold ml-2">
                Preview Post
              </Text>
            </Pressable>
          </View>

          {/* Settings Sections */}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Do You think this is a cool post? </Text>
            {/* <View style={{ flexDirection: 'row' }}>
              <Text>
                <Ionicons name="image-outline" size={24} />
              </Text>
              <Text>
                <Ionicons name="copy-outline" size={24} />
              </Text>
              <Text>
                <Ionicons name="create-outline" size={24} />
              </Text>
              <Text>
                <Ionicons name="create-outline" size={24} />
              </Text>
            </View>*/}
          </View> 

          <Text>
            This is your preview post
          </Text>


            <Pressable onPress={handleContinue}>
              <Ionicons
                name={"play-outline"}
                size={24}
                color={isDarkColorScheme ? '#ffffff' : '#000000'}
              />
              <Text>Continue</Text>
            </Pressable>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}