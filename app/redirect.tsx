import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '~/lib/auth-provider';
import { LoadingScreen } from '~/components/ui/LoadingScreen';

export default function RedirectPage() {
  const { isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/feed" />;
  }

  return <Redirect href="/login" />;
}
