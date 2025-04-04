import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { MatrixRain } from '~/components/ui/loading-effects/MatrixRain';
import { StyleSheet } from 'react-native';


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
            <Bullet text="It’s a worldwide crew of skaters, creators, and weirdos doing it our way." />
            <Bullet text="Built on DIY, decentralization, and zero corporate bullsh*t." />
            <Bullet text="No bosses, no brands calling shots — this is 100% skater-owned, skater-run." />
          </Section>

          <Section title="📼 Tech Revolution in Skateboarding">
            <Bullet text="From VX tapes to IG clips — tech’s always been part of the ride." />
            <Bullet text="Skatehive is the next chapter: community-powered + crypto rewards = freedom." />
          </Section>

          <Section title="🚀 Why It Rips">
            <Bullet text="Post-to-earn: film a trick, drop a story, share your vibe — get rewarded." />
            <Bullet text="Infinity Mag: our own never-ending skate mag. No ads. No fluff." />
            <Bullet text="Decentralized sponsorships: repping your crew, getting love from the people." />
          </Section>

          <Section title="🧰 Open-Source = Total Freedom">
            <Bullet text="Anyone can fork this sh*t — skateshops, collectives, your homie with a laptop." />
            <Bullet text="Your content echoes across the skateverse. Powered by blockchain, owned by you." />
          </Section>

          <Section title="🤝 Community-First, Always">
            <Bullet text="Likes, posts, comments — every move adds value to *our* world." />
            <Bullet text="We set the tone. No AI deciding what's cool. No engagement farms." />
          </Section>

          <Section title="🛹 Our Mission">
            <Bullet text="Put skate media back in skaters’ hands. Forever." />
            <Bullet text="Grow a real-deal global skate culture — raw, connected, and free AF." />
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
