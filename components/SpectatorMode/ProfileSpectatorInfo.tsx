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
        <CardHeader className="items-center">
          <Text className="text-3xl mb-1 font-bold text-center text-foreground">
            No Pass? No Session.
          </Text>
          
          <Text className="text-base text-center text-muted-foreground">
            You gotta earn your way in. No brands, no corporations, just raw skate energy. Ready?
          </Text>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-6 items-center">
          <Text className="text-lg font-semibold text-center text-foreground">
            Follow the Steps or Bail Out
          </Text>
          
          <View className="w-full aspect-video rounded-xl border border-muted/50 overflow-hidden" 
            accessibilityLabel="SkateHive community video">
            <VideoPlayer
              url={'https://ipfs.skatehive.app/ipfs/QmYuM1h51bddDuC44FoAQYp9FRF2CghCncULeS4T3bp727'}
              playing={false}
            />
          </View>
          
          <View className="flex flex-col flex-wrap justify-center gap-4 w-full">
            <View className="flex flex-col items-center gap-1">
              <Text className="font-bold text-foreground text-center">Step 1</Text>
              <Text className="text-foreground text-center">Watch this. Get hyped. Understand.</Text>
            </View>
            
            <View className="flex flex-col items-center gap-1">
              <Text className="font-bold text-foreground text-center">Step 2</Text>
              <Text className="text-foreground text-center">You need an invite. No invite? No ride.</Text>
            </View>
            
            <View className="flex flex-col items-center gap-1">
              <Text className="font-bold text-foreground text-center">Step 3</Text>
              <Text className="text-foreground text-center">Find us. We lurk where skaters roll.</Text>
            </View>
            
            <View className="flex flex-col items-center gap-1">
              <Text className="font-bold text-foreground text-center">Step 4</Text>
              <Text className="text-foreground text-center">Instagram or Discord? If you know, you know.</Text>
            </View>
          </View>
        
          <View className="w-full flex items-center gap-4 pt-2">
            <Button 
              variant="secondary" 
              className="w-full" 
              onPress={handleJoinCommunity}
              accessibilityLabel="Join SkateHive community button"
            >
              <Text className="text-center">Prove You Belong</Text>
            </Button>
          </View>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-4">
          <Text className="text-xl font-semibold text-center text-foreground">
            Find Us (If You Can)
          </Text>
          
          <View className="flex flex-row justify-center gap-8">
            {socialLinks.map((link) => (
              <TouchableOpacity 
                key={link.name} 
                onPress={() => openSocialLink(link.url)}
                accessibilityLabel={`${link.name} social media link`}
                accessibilityRole="link"
              >
                <View className="flex flex-col items-center gap-2">
                  <Icon name={link.icon} size={32} color={link.color} />
                  <Text className="text-sm text-center text-muted-foreground">{link.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </CardFooter>
      </Card>
    </View>
  );
}
