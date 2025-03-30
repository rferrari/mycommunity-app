import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { STORED_USERS_KEY } from './constants';
import { 
  validate_posting_key, 
  HiveError, 
  InvalidKeyFormatError, 
  AccountNotFoundError, 
  InvalidKeyError 
} from './hive-utils';

// Custom error types for authentication
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isLoading: boolean;
  storedUsers: string[];
  login: (username: string, postingKey: string) => Promise<void>;
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

  const login = async (username: string, postingKey: string) => {
    try {
      const normalizedUsername = username.toLowerCase().trim();
      
      if (!normalizedUsername || !postingKey) {
        throw new AuthError('Username and posting key are required');
      }
      
      // Validate the posting key with the Hive blockchain
      await validate_posting_key(normalizedUsername, postingKey);
      
      // Store the posting key
      await SecureStore.setItemAsync(normalizedUsername, postingKey);
      await updateStoredUsers(normalizedUsername);
      
      setUsername(normalizedUsername);
      setIsAuthenticated(true);
    } catch (error) {
      // Handle specific error types with meaningful messages
      if (error instanceof InvalidKeyFormatError ||
          error instanceof AccountNotFoundError ||
          error instanceof InvalidKeyError ||
          error instanceof AuthError) {
        throw error; // Pass the error with its meaningful message
      } else {
        console.error('Error during login:', error);
        throw new AuthError('Failed to authenticate with Hive blockchain');
      }
    }
  };

  const loginStoredUser = async (selectedUsername: string) => {
    try {
      const storedPostingKey = await SecureStore.getItemAsync(selectedUsername);
      if (!storedPostingKey) {
        throw new AuthError('No stored credentials found');
      }
      
      // Validate that the stored posting key is still valid
      await validate_posting_key(selectedUsername, storedPostingKey);
      
      await updateStoredUsers(selectedUsername);
      setUsername(selectedUsername);
      setIsAuthenticated(true);
    } catch (error) {
      // Handle specific error types
      if (error instanceof InvalidKeyFormatError ||
          error instanceof AccountNotFoundError ||
          error instanceof InvalidKeyError ||
          error instanceof AuthError) {
        throw error; // Pass the error with its meaningful message
      } else {
        console.error('Error with stored user login:', error);
        throw new AuthError('Failed to authenticate with stored credentials');
      }
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