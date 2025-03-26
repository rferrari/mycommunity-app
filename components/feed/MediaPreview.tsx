import React from 'react';
import { Image, Modal, Pressable, View } from 'react-native';
import { Text } from '../ui/text';
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
    <View key="media-preview-container" className="mb-3">
      <View key="media-grid" className="flex-row flex-wrap gap-1">
        {media.map((item, index) => (
          <View
            key={`media-item-${index}-${item.url}`}
            className={`${media.length === 1 ? 'w-full' : 'w-[49%]'} aspect-square rounded-lg overflow-hidden relative bg-gray-100`}
          >
            {item.type === 'video' ? (
              <View key={`video-wrapper-${index}`}>
                <VideoPlayer url={item.url} />
              </View>
            ) : (
              <Pressable
                key={`image-pressable-${index}`}
                onPress={() => onMediaPress(item)}
                className="w-full h-full"
                accessibilityRole="button"
                accessibilityLabel="View full size image"
              >
                <Image
                  source={{ uri: item.url }}
                  className="w-full h-full"
                  resizeMode="cover"
                  accessibilityRole="image"
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
        animationType="fade"
      >
        <Pressable
          key="modal-pressable"
          className="flex-1 bg-black/80 justify-center items-center"
          onPress={onCloseModal}
          accessibilityRole="button"
          accessibilityLabel="Close media preview"
        >
          <View key="modal-content" className="w-full h-[80%] justify-center">
            {selectedMedia?.type === 'image' ? (
              <Image
                source={{ uri: selectedMedia.url }}
                className="w-full h-full"
                resizeMode="contain"
                accessibilityRole="image"
              />
            ) : selectedMedia?.type === 'video' ? (
              <VideoPlayer url={selectedMedia.url} />
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}