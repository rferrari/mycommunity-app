import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';

interface VideoPlayerProps {
  url: string;
  onToggleMute: () => void;
}

export const VideoPlayer = React.memo(({ url, onToggleMute }: VideoPlayerProps) => {
  const player = useVideoPlayer(url, player => {
    player.loop = true;
    player.muted = true;
  });
  
  const { muted } = useEvent(player, 'mutedChange', { muted: player.muted });

  const handleMutePress = () => {
    player.muted = !player.muted;
    onToggleMute();
  };

  return (
    <>
      <VideoView
        style={{ width: '100%', height: '100%' }}
        player={player}
        allowsFullscreen={false}
      />
      <View className="absolute bottom-2 right-2 z-10">
        <Pressable
          className="bg-black/50 p-2.5 rounded-full w-10 h-10 items-center justify-center"
          onPress={handleMutePress}
        >
          <FontAwesome
            name={muted ? "volume-off" : "volume-up"}
            size={20}
            color="white"
          />
        </Pressable>
      </View>
    </>
  );
});