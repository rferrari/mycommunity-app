import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '~/components/ui/loading-effects/MatrixRain';
import {  StyleSheet } from 'react-native';


export default function AboutScreen() {
  const { isDarkColorScheme } = useColorScheme();


  return (
    <View className="flex-1 bg-background">
      <MatrixRain />
      <View className="flex-1">
        {/* Header with back button */}
        <View className="flex-row items-center p-4 pt-12">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkColorScheme ? '#ffffff' : '#000000'}
            />
          </Pressable>
          <Text className="text-2xl font-bold ml-2">Skatehive Community</Text>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6">
        <Text style={styles.heading}></Text>

<Section title="🌍 What is Skatehive?">
  <Bullet text="A global community of skaters, creators, and enthusiasts." />
  <Bullet text="Built on decentralization, creativity, and collaboration." />
  <Bullet text="No central authority — it’s skater-owned and skater-driven." />
</Section>

<Section title="📼 Tech Revolution in Skateboarding">
  <Bullet text="From VX1000 to social media, tech has shaped skate culture." />
  <Bullet text="Skatehive is the next evolution, blending community + rewards." />
</Section>

<Section title="🚀 Key Features">
  <Bullet text="Post-to-earn: Get rewarded for sharing tricks, clips, stories." />
  <Bullet text="Infinity Mag: A digital skate mag built by and for skaters." />
  <Bullet text="Decentralized sponsorships: Recognition from the community." />
</Section>

<Section title="🧰 Open-Source Power">
  <Bullet text="Tech is open-source: any crew or skateshop can clone it." />
  <Bullet text="Content broadcasted across a network of skate sites via blockchain." />
</Section>

<Section title="🤝 Community Focus">
  <Bullet text="Every like, post, or comment adds value to the ecosystem." />
  <Bullet text="Skaters curate their own culture — not controlled by algorithms." />
</Section>

<Section title="🛹 The Mission">
  <Bullet text="Return control of skate media to skaters." />
  <Bullet text="Build a vibrant, connected, and fair global skate culture — together." />
</Section>
        </ScrollView>
      </View>
    </View>
  );
}


function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletText}>•</Text>
      <Text style={styles.bulletContent}>{text}</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 20,
    marginRight: 6,
  },
  bulletContent: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
});
