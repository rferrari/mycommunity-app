import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useColorScheme } from '~/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const STYLES = [
  { id: 'snap', name: 'Snap', icon: '🛹' },
  { id: 'feed', name: 'Feed', icon: '🛹' },
  { id: 'vert', name: 'Mag', icon: '🛹' },
];

export default function StartScreen() {
  const [selectedStyles, setSelectedStyles] = React.useState<string[]>([]);
  const { isDarkColorScheme } = useColorScheme();

  const toggleStyle = (styleId: string) => {
    router.push('/(createpost)/write');
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleCloseWallet = () => {
    router.push('/(tabs)/feed');
  };


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
                Create New Post
              </Text>
            </Pressable>
          </View>

          {/* Settings Sections */}
          <View className="flex-1 p-6">
            <Text className="text-3xl font-bold mb-6">
              What You Want To Create?
            </Text>

            <Text className="text-lg opacity-70 mb-8">
              Choose one that apply.
            </Text>

            <ScrollView className="flex-1">
              <View className="flex-row flex-wrap justify-between">
                {STYLES.map(style => (
                  <Pressable
                    key={style.id}
                    onPress={() => toggleStyle(style.id)}
                    className={`w-[48%] p-4 rounded-lg mb-4 ${selectedStyles.includes(style.id)
                      ? 'bg-foreground'
                      : 'bg-foreground/10'
                      }`}
                  >
                    <Text className={`text-2xl text-center mb-2 ${selectedStyles.includes(style.id) ? 'text-background' : 'text-foreground'
                      }`}>
                      {style.icon}
                    </Text>
                    <Text className={`text-center font-medium ${selectedStyles.includes(style.id) ? 'text-background' : 'text-foreground'
                      }`}>
                      {style.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* <View className="pt-6 space-y-4">
              <Button
                // onPress={() => router.push('/onboarding/experience')}
                className="bg-foreground w-full"
                disabled={selectedStyles.length === 0}
              >
                <Text className="text-xl font-bold text-background">
                  Next
                </Text>
              </Button>

              <Button
                onPress={() => router.back()}
                className="bg-foreground/10 w-full"
              >
                <Text className="text-xl font-bold text-foreground">
                  Back
                </Text>
              </Button>
            </View> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

