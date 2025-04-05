import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text } from "~/components/ui/text";
import { pop_communities } from "~/lib/hooks/useCommunities";

interface Props {
  onSelect: (community: [string, string]) => void;
}

export const PopCommunitiesSelector = ({ onSelect }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = pop_communities.filter(([, name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string, name: string) => {
    setSelected(name);
    setModalVisible(false);
    onSelect([id, name]);
  };

  return (
    <View>
      <TouchableOpacity
        className="bg-foreground/10 p-3 rounded"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white">
          {selected ?? "Select a community..."}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-background w-full rounded-xl p-4 max-h-[60%]">
            <TextInput
              className="bg-foreground/10 p-2 rounded text-white mb-2"
              placeholder="Search..."
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
            />

            <FlatList
              data={filtered}
              keyExtractor={([id]) => id}
              renderItem={({ item: [id, name] }) => (
                <Pressable
                  onPress={() => handleSelect(id, name)}
                  className="p-2 border-b border-white/10"
                >
                  <Text className="text-white">{name}</Text>
                </Pressable>
              )}
              keyboardShouldPersistTaps="handled"
            />

            <Pressable
              onPress={() => setModalVisible(false)}
              className="mt-3 bg-foreground/20 rounded p-2"
            >
              <Text className="text-white text-center">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
