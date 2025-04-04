import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, TouchableOpacity, Linking } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "../ui/button";
import { VideoPlayer } from '~/components/Feed/VideoPlayer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { IconName, SpectatorInfoBase } from "./SpectatorInfoBase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

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

  const infoItems = [
    {
      icon: "videocam-outline" as IconName,
      title: "Watch",
      text: "Watch this. Get hyped. Understand.",
    },
    {
      icon: "key-outline" as IconName,
      title: "Invitation Only",
      text: "You need an invite. No invite? No ride.",
    },
    {
      icon: "search-outline" as IconName,
      title: "Find Us",
      text: "Find us. We lurk where skaters roll.",
    },
    {
      icon: "logo-discord" as IconName,
      title: "Connect",
      text: "Instagram or Discord? If you know, you know.",
    },
  ];

  return (
    <Card className="w-full mt-4">
      <CardContent className="py-4">
        <SpectatorInfoBase
          iconColor="#34C759"
          title="No Pass? No Session."
          description="You gotta earn your way in. No brands, no corporations, just raw skate energy. Ready?"
          infoItems={infoItems}
        />
        
        {/* Video Player Section */}
        <View className="w-full aspect-video rounded-xl border border-muted/50 overflow-hidden mt-6 mb-4" 
          accessibilityLabel="SkateHive community video">
          <VideoPlayer
            url={'https://ipfs.skatehive.app/ipfs/QmYuM1h51bddDuC44FoAQYp9FRF2CghCncULeS4T3bp727'}
            playing={false}
          />
        </View>
      </CardContent>
        
      <CardFooter className="flex-col items-center">
        <CardTitle className="mb-4">
          Find Us
        </CardTitle>
        
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
  );
}
