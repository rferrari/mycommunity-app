import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = React.memo(({ url }: VideoPlayerProps) => {
  const player = useVideoPlayer(url, player => {
    player.loop = true;
  });
  
  return (
    <VideoView
      style={{ width: '100%', height: '100%' }}
      player={player}
      allowsFullscreen={false}
    />
  );
});