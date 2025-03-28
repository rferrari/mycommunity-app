import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { STORED_USERS_KEY } from './constants';
import { hive_keys_from_login } from './hive-utils';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isLoading: boolean;
  storedUsers: string[];
  login: (username: string, password: string) => Promise<void>;
  loginStoredUser: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  enterSpectatorMode: () => Promise<void>;
  deleteAllStoredUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storedUsers, setStoredUsers] = useState<string[]>([]);

  useEffect(() => {
    loadStoredUsers();
    checkCurrentUser();
  }, []);

  const loadStoredUsers = async () => {
    try {
      const storedUsersJson = await SecureStore.getItemAsync(STORED_USERS_KEY);
      const lastUser = await SecureStore.getItemAsync('lastLoggedInUser');
      
      let users: string[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
      
      if (lastUser) {
        users = users.filter(user => user !== lastUser);
        users.unshift(lastUser);
      }

      setStoredUsers(users);
    } catch (error) {
      console.error('Error loading stored users:', error);
    }
  };

  const checkCurrentUser = async () => {
    try {
      const currentUser = await SecureStore.getItemAsync('lastLoggedInUser');
      if (currentUser) {
        setUsername(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoredUsers = async (username: string) => {
    try {
      let users = [...storedUsers];
      users = users.filter(user => user !== username);
      users.unshift(username);
      setStoredUsers(users);
      await SecureStore.setItemAsync(STORED_USERS_KEY, JSON.stringify(users));
      await SecureStore.setItemAsync('lastLoggedInUser', username);
    } catch (error) {
      console.error('Error updating stored users:', error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const normalizedUsername = username.toLowerCase().trim();
      
      // Validate credentials with Hive
      hive_keys_from_login(normalizedUsername, password);
      
      // Store credentials
      await SecureStore.setItemAsync(normalizedUsername, password);
      await updateStoredUsers(normalizedUsername);
      
      setUsername(normalizedUsername);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Invalid credentials');
    }
  };

  const loginStoredUser = async (selectedUsername: string) => {
    try {
      const storedPassword = await SecureStore.getItemAsync(selectedUsername);
      if (storedPassword) {
        await updateStoredUsers(selectedUsername);
        setUsername(selectedUsername);
        setIsAuthenticated(true);
      } else {
        throw new Error('No stored credentials found');
      }
    } catch (error) {
      console.error('Error with stored user login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (username) {
        // Remove from stored users
        const users = storedUsers.filter(user => user !== username);
        await SecureStore.setItemAsync(STORED_USERS_KEY, JSON.stringify(users));
        
        // Clear current user data
        await SecureStore.deleteItemAsync('lastLoggedInUser');
        await SecureStore.deleteItemAsync(username);
        
        setStoredUsers(users);
        setUsername(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const enterSpectatorMode = async () => {
    try {
      await SecureStore.setItemAsync('lastLoggedInUser', 'SPECTATOR');
      setUsername('SPECTATOR');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error entering spectator mode:', error);
      throw error;
    }
  };

  const deleteAllStoredUsers = async () => {
    try {
      await SecureStore.deleteItemAsync(STORED_USERS_KEY);
      await SecureStore.deleteItemAsync('lastLoggedInUser');
      setStoredUsers([]);
    } catch (error) {
      console.error('Error deleting all users:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated,
        username,
        isLoading,
        storedUsers,
        login,
        loginStoredUser,
        logout,
        enterSpectatorMode,
        deleteAllStoredUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}