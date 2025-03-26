import React from 'react';
import { Image, Modal, Pressable, View } from 'react-native';
import { VideoPlayer } from './VideoPlayer';
import type { Media } from './types';

interface MediaPreviewProps {
  media: Media[];
  onMediaPress: (media: Media) => void;
  selectedMedia: Media | null;
  isModalVisible: boolean;
  onCloseModal: () => void;
}

export function MediaPreview({
  media,
  onMediaPress,
  selectedMedia,
  isModalVisible,
  onCloseModal,
}: MediaPreviewProps) {
  return (
    <>
      <View className="flex-row flex-wrap gap-1 mb-3">
        {media.map((item, index) => (
          <View
            key={index}
            className={`${media.length === 1 ? 'w-full' : 'w-[49%]'} aspect-square overflow-hidden relative bg-gray-100`}
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