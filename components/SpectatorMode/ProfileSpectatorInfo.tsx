import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, TouchableOpacity, Linking } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "../ui/button";
import { VideoPlayer } from '~/components/Feed/VideoPlayer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";

interface SocialLink {
  name: string;
  icon: string;
  color: string;
  url: string;
}

export function ProfileSpectatorInfo() {
  const { isDarkColorScheme } = useColorScheme();
  
  const handleJoinCommunity = () => {
    router.push("/(onboarding)/home");
  };
  
  const socialLinks: SocialLink[] = [
    { 
      name: 'Twitter', 
      icon: 'twitter', 
      color: '#1DA1F2', 
      url: 'https://twitter.com/skatehive' 
    },
    { 
      name: 'Instagram', 
      icon: 'instagram', 
      color: '#E4405F', 
      url: 'https://instagram.com/skatehive' 
    },
    { 
      name: 'GitHub', 
      icon: 'github', 
      color: isDarkColorScheme ? '#FFFFFF' : '#333333', 
      url: 'https://github.com/skatehive' 
    }
  ];
  
  const openSocialLink = (url: string) => {
    Linking.openURL(url).catch(err => 
      console.error('Error opening URL:', err)
    );
  };

  return (
    <View className="items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <Text className="text-3xl mb-1 font-bold text-center text-foreground">
            Join SkateHive
          </Text>
          
          <Text className="text-base text-center text-muted-foreground">
            Skatehive is a global community that unites skaters, content creators, and enthusiasts to share, learn, and collaborate.
          </Text>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <View className="w-full aspect-video rounded-xl border border-muted/50 overflow-hidden" 
            accessibilityLabel="SkateHive community video">
            <VideoPlayer
              url={'https://ipfs.skatehive.app/ipfs/QmYuM1h51bddDuC44FoAQYp9FRF2CghCncULeS4T3bp727'}
              playing={false}
            />
          </View>
        
          <View className="w-full space-y-4">
            <Text className="text-xl font-semibold text-center text-foreground">
              Take the next step in your skating journey
            </Text>
            
            <Button 
              variant="secondary" 
              className="w-full" 
              onPress={handleJoinCommunity}
              accessibilityLabel="Join SkateHive community button"
            >
              <Text>Join Our Community</Text>
            </Button>
          </View>
        </CardContent>
        
        <CardFooter className="flex-col space-y-4">
          <Text className="text-xl font-semibold text-center text-foreground">
            Connect with us
          </Text>
          
          <View className="flex-row justify-center space-x-8">
            {socialLinks.map((link) => (
              <TouchableOpacity 
                key={link.name} 
                onPress={() => openSocialLink(link.url)}
                accessibilityLabel={`${link.name} social media link`}
                accessibilityRole="link"
              >
                <View className="items-center space-y-2">
                  <Icon name={link.icon} size={32} color={link.color} />
                  <Text className="text-sm text-muted-foreground">{link.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </CardFooter>
      </Card>
    </View>
  );
}
