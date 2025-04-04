import { Redirect } from 'expo-router';
import React from 'react';
import { LoadingScreen } from '~/components/ui/LoadingScreen';
import { useAuth } from '~/lib/auth-provider';

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
