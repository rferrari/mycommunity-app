import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, TextInput, Pressable, Text } from "react-native";
import { getGroqResponse, getRAGResponse } from "~/components/RagSystem/api";

const RAGComponent = () => {
    const [userQuery, setUserQuery] = useState("");
    const [lastUserQuery, setLastUserQuery] = useState("");
    const [ragResponse, setRagResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // const animation = new Animated.Value(0);
  
    const handleSend = async () => {
      if (userQuery.trim()) {
        setIsLoading(true);

        try {
          setLastUserQuery(userQuery + "\n\n");
          const response = await getRAGResponse(userQuery);
          setRagResponse(response);
        } catch (error) {
        //   console.error('Error fetching response:', error);
          setRagResponse('An error occurred. Please try again.'); 
        } finally {
          setIsLoading(false);
          setUserQuery(""); 
        }
      }
    };
  
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1 mt-10">
          <Text className="text-white text-center">Skatehive AI Assistent</Text>
          <TextInput
            value={userQuery}
            onChangeText={setUserQuery}
            placeholder="Ask SkateHive Docs...."
            placeholderTextColor="#fff"
            className="text-white bg-background p-4 text-xl border p-2 text-gray-600"
          />
          <Pressable onPress={handleSend} className="bg-blue-500 p-2 rounded">
            <Text className="text-white text-center">Send</Text>
          </Pressable>
          <View
           className="p-2 space-y-4 flex-row items-center justify-center p-2 space-y-4 max-w-full w-full">
            {isLoading ? (
                <Text className="text-white">Thinking...</Text> 
            ) : (
                <Text className="text-white">{lastUserQuery}{ragResponse}</Text> 
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
    
  export default RAGComponent;