import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Text, View } from 'react-native';

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = React.memo(({ url }: VideoPlayerProps) => {
  const player = useVideoPlayer(url, player => {
    player.loop = true;
  });
  
  return (
    <View accessibilityRole="none">
      <VideoView
        style={{ width: '100%', height: '100%' }}
        contentFit='cover'
        player={player}
        allowsFullscreen={true}
        accessibilityLabel="Video content"
      />
    </View>
  );
});