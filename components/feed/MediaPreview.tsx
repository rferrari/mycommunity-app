import React, { useState } from 'react';
import { Image, Modal, Pressable, View, Dimensions } from 'react-native';
import { VideoPlayer } from './VideoPlayer';
import type { Media } from '../../lib/types';

interface MediaPreviewProps {
  media: Media[];
  onMediaPress: (media: Media) => void;
  selectedMedia: Media | null;
  isModalVisible: boolean;
  onCloseModal: () => void;
}

// For calculating image dimensions
const { width: screenWidth } = Dimensions.get('window');

export function MediaPreview({
  media,
  onMediaPress,
  selectedMedia,
  isModalVisible,
  onCloseModal,
}: MediaPreviewProps) {
  // Track dimensions for each image to maintain proper aspect ratio
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number, height: number }>>({});

  // Calculate appropriate dimensions when image loads
  const handleImageLoad = (index: number, width: number, height: number) => {
    setImageDimensions(prev => ({
      ...prev,
      [index]: { width, height }
    }));
  };

  // Calculate display width based on number of media items
  const getContainerWidth = (index: number) => {
    const containerWidth = media.length === 1 
      ? screenWidth - 16 // Full width (minus padding)
      : (screenWidth - 24) / 2; // Half width (minus padding and gap)
    
    return containerWidth;
  };

  // Calculate height based on image's aspect ratio
  const getImageHeight = (index: number) => {
    const dimensions = imageDimensions[index];
    if (!dimensions) return 200; // Default height until image loads
    
    const containerWidth = getContainerWidth(index);
    const aspectRatio = dimensions.width / dimensions.height;
    return containerWidth / aspectRatio;
  };

  return (
    <>
      <View className="flex-row flex-wrap gap-1 mb-3">
        {media.map((item, index) => (
          <View
            key={index}
            className={`${media.length === 1 ? 'w-full' : 'w-[49%]'} overflow-hidden relative bg-gray-100`}
            style={{ height: item.type === 'video' ? 200 : getImageHeight(index) }}
          >
            {item.type === 'video' ? (
              <View className="w-full h-full">
                <VideoPlayer url={item.url} />
              </View>
            ) : (
              <Pressable
                onPress={() => onMediaPress(item)}
                className="w-full h-full"
              >
                <Image
                  source={{ uri: item.url }}
                  className="w-full h-full"
                  resizeMode="cover"
                  onLoad={(e) => {
                    const { width, height } = e.nativeEvent.source;
                    handleImageLoad(index, width, height);
                  }}
                />
              </Pressable>
            )}
          </View>
        ))}
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={onCloseModal}
      >
        <Pressable
          className="flex-1 bg-black/80 justify-center items-center"
          onPress={onCloseModal}
        >
          <View className="w-full h-[80%] justify-center">
            {selectedMedia?.type === 'image' ? (
              <Image
                source={{ uri: selectedMedia.url }}
                className="w-full h-full"
                resizeMode="contain"
              />
            ) : selectedMedia?.type === 'video' ? (
              <VideoPlayer url={selectedMedia.url} />
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}