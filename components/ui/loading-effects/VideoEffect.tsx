import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import type { LoadingEffect } from './types';
import { useVideoPlayer, VideoView } from 'expo-video';


const { width, height } = Dimensions.get('window');


export function VideoEffect() {  
  const { isDarkColorScheme } = useColorScheme();

  const player = useVideoPlayer(require('../../../assets/videos/output2.mp4'), player => {
    player.loop = true;
    player.play();
  });
  
  return (
    <View className="absolute inset-0">
      <VideoView
        style={{ width: '100%', height: '100%' }}
        contentFit='cover'
        player={player}
      />
      <View className="absolute inset-0 bg-black/20" />
    </View>
  );
}

export const videoEffect: LoadingEffect = {
  id: 'video',
  component: VideoEffect
};