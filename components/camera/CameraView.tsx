import React, { useState, useRef } from 'react';
import { View, Pressable, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import { Text } from '../ui/text';
import { Ionicons } from '@expo/vector-icons';

const FILTERS = [
  { name: 'Normal', manipulation: [] },
  { name: 'B&W', manipulation: [{ saturate: 0 }] },
  { name: 'Sepia', manipulation: [{ sepia: 1 }] },
  { name: 'Vibrant', manipulation: [{ saturate: 2 }] },
  { name: 'Cool', manipulation: [{ temperature: -20 }] },
  { name: 'Warm', manipulation: [{ temperature: 20 }] }
];

export function CameraView() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const cameraRef = useRef<Camera>(null);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center mb-4">
          We need your permission to use the camera
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-foreground px-6 py-3 rounded-lg"
        >
          <Text className="text-background">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const toggleCameraType = () => {
    setType(current => (
      current === CameraType.back ? CameraType.front : CameraType.back
    ));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      applyFilter(photo.uri, FILTERS[selectedFilter].manipulation);
    }
  };

  const applyFilter = async (uri: string, manipulations: ImageManipulator.Manipulation[]) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        manipulations,
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      setPhoto(manipulatedImage.uri);
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  };

  const savePhoto = async () => {
    if (photo) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo);
        setPhoto(null); // Reset to camera view
      } catch (error) {
        console.error('Error saving photo:', error);
      }
    }
  };

  return (
    <View className="flex-1">
      {!photo ? (
        <Camera 
          ref={cameraRef}
          type={type}
          className="flex-1"
        >
          <View className="flex-1 justify-between p-4">
            {/* Camera controls */}
            <View className="flex-row justify-end">
              <Pressable
                onPress={toggleCameraType}
                className="bg-background/20 p-2 rounded-full"
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </Pressable>
            </View>

            {/* Filter selector */}
            <View className="flex-row justify-center mb-4">
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="bg-background/20 rounded-lg p-2"
              >
                {FILTERS.map((filter, index) => (
                  <Pressable
                    key={filter.name}
                    onPress={() => setSelectedFilter(index)}
                    className={`px-4 py-2 rounded-lg mx-1 ${
                      selectedFilter === index ? 'bg-foreground' : 'bg-transparent'
                    }`}
                  >
                    <Text className={selectedFilter === index ? 'text-background' : 'text-foreground'}>
                      {filter.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Capture button */}
            <View className="flex-row justify-center">
              <Pressable
                onPress={takePicture}
                className="bg-foreground w-16 h-16 rounded-full items-center justify-center"
              >
                <View className="w-14 h-14 rounded-full border-2 border-background" />
              </Pressable>
            </View>
          </View>
        </Camera>
      ) : (
        <View className="flex-1">
          <Image 
            source={{ uri: photo }} 
            className="flex-1"
            resizeMode="contain"
          />
          <View className="absolute bottom-0 w-full flex-row justify-around p-4 bg-background/20">
            <Pressable
              onPress={() => setPhoto(null)}
              className="bg-red-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white">Retake</Text>
            </Pressable>
            <Pressable
              onPress={savePhoto}
              className="bg-foreground px-6 py-3 rounded-lg"
            >
              <Text className="text-background">Save</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}