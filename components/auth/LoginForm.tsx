import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface LoginFormProps {
  username: string;
  password: string;
  message: string;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => Promise<void>;
  onSpectator: () => Promise<void>;
  storedUsers?: string[];
  onQuickLogin?: (username: string) => Promise<void>;
  isDarkColorScheme: boolean;
}

export function LoginForm({
  username,
  password,
  message,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onSpectator,
  isDarkColorScheme,
}: LoginFormProps) {
  return (
    <View className="w-full max-w-sm flex flex-col gap-1">
      <Text className="text-4xl font-bold text-center text-foreground mb-8">
        Login
      </Text>

      <Input
        placeholder="Hive Username"
        value={username}
        onChangeText={onUsernameChange}
        className="bg-foreground/10 px-4 py-3 rounded-lg text-foreground"
        placeholderTextColor={isDarkColorScheme ? "#ffffff80" : "#00000080"}
        autoCapitalize="none"
        autoComplete="username"
        textContentType="username"
      />
      <Input
        placeholder="Posting Key"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        className="bg-foreground/10 px-4 py-3 rounded-lg text-foreground"
        placeholderTextColor={isDarkColorScheme ? "#ffffff80" : "#00000080"}
        autoComplete="password"
        textContentType="password"
      />

      <Button
        onPress={onSubmit}
        className="mt-3 bg-foreground transition-all duration-[20ms] active:scale-[0.975]"
        haptic={"light"}
      >
        <Text className="text-background font-medium">Login</Text>
      </Button>

      <Button
        onPress={onSpectator}
        variant="ghost"
        className="mt-2"
      >
        <Text>Enter as Spectator</Text>
      </Button>

      {message ? (
        <Text className={`text-center mx-10 ${message.includes('deleted') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
