import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';
import { CssTextProvider } from './components/ui/CssTextProvider';

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return (
    <CssTextProvider>
      <ExpoRoot context={ctx} />
    </CssTextProvider>
  );
}

registerRootComponent(App);
