import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';

const STYLES = [
  { id: 'amateur', name: 'Amateur', icon: '🎭' },
  { id: 'beginer', name: 'Beginer', icon: '🏗️' },
  { id: 'advanced', name: 'Advanced', icon: '🎪' },
  { id: 'pro', name: 'Pro', icon: '⛰️' },
  { id: 'legend', name: 'Legend', icon: '🛹' },
];

export default function ExperienceScreen() {
  const [selectedStyles, setSelectedStyles] = React.useState<string[]>([]);

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev => 
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold mb-6">
          What's Your Style?
        </Text>
        
        <Text className="text-lg opacity-70 mb-8">
          Choose all that apply. This helps us show you relevant content.
        </Text>

        <ScrollView className="flex-1">
          <View className="flex-row flex-wrap justify-between">
            {STYLES.map(style => (
              <Pressable
                key={style.id}
                onPress={() => toggleStyle(style.id)}
                className={`w-[48%] p-4 rounded-lg mb-4 ${
                  selectedStyles.includes(style.id)
                    ? 'bg-foreground'
                    : 'bg-foreground/10'
                }`}
              >
                <Text className={`text-2xl text-center mb-2 ${
                  selectedStyles.includes(style.id) ? 'text-background' : 'text-foreground'
                }`}>
                  {style.icon}
                </Text>
                <Text className={`text-center font-medium ${
                  selectedStyles.includes(style.id) ? 'text-background' : 'text-foreground'
                }`}>
                  {style.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View className="pt-6 space-y-4">
          <Button 
            onPress={() => router.push('/(onboarding)/welcome')}
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
        </View>
      </View>
    </SafeAreaView>
  );
}