# MyCommunity App - Copilot Instructions

## Project Overview
MyCommunity App is a React Native mobile application built with Expo, leveraging the HIVE blockchain for authentication and social functionality. The app follows a modern, component-based architecture with TypeScript and uses NativeWind (TailwindCSS) for styling.

## Technology Stack
- **Framework**: React Native with Expo
- **State Management**: React Context
- **Navigation**: Expo Router
- **Styling**: NativeWind/TailwindCSS
- **Data Fetching**: React Query (@tanstack/react-query)
- **Authentication**: HIVE blockchain integration (@hiveio/dhive)
- **Media Handling**: Expo camera, image picker, and video components
- **Storage**: Expo SecureStore for sensitive data

## Code Conventions

### TypeScript
- Always use TypeScript with strict type definitions for all components, functions, and variables
- Create interfaces for all data structures in the `lib/types.ts` file
- Use type inference when the type is obvious

```typescript
// Good
interface UserProfile {
  username: string;
  reputation: number;
  followers: string[];
}

// Avoid
const user: any = { username: 'johndoe' };
```

### Asynchronous Code
- Use async/await for all asynchronous operations
- Handle errors with try/catch blocks
- Show loading states during async operations

```typescript
// Good
const fetchData = async () => {
  try {
    setIsLoading(true);
    const data = await api.getData();
    setData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle error appropriately
  } finally {
    setIsLoading(false);
  }
};

// Avoid
const fetchData = () => {
  api.getData()
    .then(data => setData(data))
    .catch(error => console.error(error));
};
```

### Components
- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Follow a consistent folder structure:
  - Shared UI components in `components/ui/` (see button.tsx, card.tsx, text.tsx)
  - Feature-specific components in dedicated folders like `components/auth/` (see LoginForm.tsx)
- Use prop destructuring and default values

```typescript
// Good
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

const Button = ({ label, onPress, variant = 'primary' }: ButtonProps) => {
  // Component implementation
};
```

### Styling
- Use NativeWind (TailwindCSS) classes for styling
- Follow the project's established color scheme and design patterns
- Use the `className` prop for styling components
- For dynamic styling, combine Tailwind classes using string templates or libraries like `clsx` or `tailwind-merge`
- See `components/ui/button.tsx` for examples of NativeWind implementation

```typescript
// Good
<View className="flex-1 bg-background p-4">
  <Text className={clsx("text-foreground", isHighlighted && "font-bold")}>
    Hello World
  </Text>
</View>

// Avoid
<View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
  <Text style={{ color: '#000' }}>Hello World</Text>
</View>
```

### State Management
- Use React Query for server state (API data) - see `lib/hooks/useQueries.ts`
- Use React Context for global application state - see `lib/auth-provider.tsx` for authentication context
- Use React's useState for local component state
- Use useReducer for complex local state logic

### Navigation
- Use Expo Router for all navigation
- Follow the established file-based routing structure in the `app/` directory
- Use route groups for organizing related screens (e.g., `app/(tabs)/`, `app/(onboarding)/`)
- See `app/_layout.tsx` and `app/(tabs)/_layout.tsx` for navigation setup examples

### Authentication
- Use the provided AuthContext (`lib/auth-provider.tsx`) for all authentication operations
- Store sensitive information like HIVE posting keys using SecureStore
- Handle authentication errors appropriately - see error class definitions in `lib/auth-provider.tsx`
- Authentication UI components are located in `components/auth/`

### API Integration
- Use the functions defined in `lib/api.ts` for API interactions
- Create new API functions following the established pattern in `lib/api.ts`
- Use React Query for data fetching, caching, and state management - see implementations in `lib/hooks/useQueries.ts`
- API base URL and constants are defined in `lib/constants.ts`

## File Organization
- `app/` - Expo Router screens and navigation structure
  - `(tabs)/` - Main tab screens (feed.tsx, profile.tsx, etc.)
  - `(onboarding)/` - Onboarding screens
  - `(settingstabs)/` - Settings screens
  - `_layout.tsx` - Root layout and navigation setup
- `assets/` - Static assets like images and videos
  - `images/` - App icons and image assets
  - `videos/` - Video assets like background.mp4
- `components/` - Reusable UI components
  - `ui/` - Base UI components (button.tsx, text.tsx, etc.)
  - `auth/` - Authentication related components
  - `feed/` - Feed-related components like PostCard.tsx
- `lib/` - Core utilities, types, and business logic
  - `hooks/` - Custom React hooks
  - `icons/` - Icon components
  - `api.ts` - API integration functions
  - `auth-provider.tsx` - Authentication context
  - `types.ts` - TypeScript interfaces and types
  - `utils.ts` - Utility functions

## Best Practices
1. Follow the DRY (Don't Repeat Yourself) principle
2. Write meaningful comments for complex logic
3. Break down large components into smaller, reusable ones
4. Handle loading states and errors gracefully - see LoadingScreen.tsx in components/ui
5. Optimize performance by avoiding unnecessary re-renders
6. Use React's memo, useCallback, and useMemo appropriately
7. Follow HIVE blockchain best practices for transactions and authentication

## Testing
- Test critical components and utilities
- Ensure mobile-specific functionality works across platforms (iOS and Android)
- Test authentication flows thoroughly
- Implement UI tests for critical user flows

## Performance Considerations
- Optimize media (images/videos) loading and caching
- Use React Query's caching capabilities (see lib/hooks/useQueries.ts)
- Implement virtualized lists for long scrollable content
- Minimize unnecessary re-renders
- Use optimized components for media rendering (see components/feed/VideoPlayer.tsx)

## Accessibility
- Ensure components have appropriate accessibility labels
- Support screen readers via appropriate aria attributes
- Test with different font sizes and contrast settings
- Follow React Native accessibility best practices

## HIVE Blockchain Integration
- Follow HIVE best practices for key management
- Use `@hiveio/dhive` for blockchain interactions (see lib/hive-utils.ts)
- Implement proper error handling for blockchain operations
- Consider transaction broadcasting timeouts and retry mechanisms
- See `lib/hive-utils.ts` for examples of HIVE blockchain utilities

## Error Handling Patterns
- Use custom error classes for specific error types (see AuthError in lib/auth-provider.tsx)
- Display user-friendly error messages
- Log detailed error information for debugging
- Implement graceful fallbacks for network failures

## Project Environment
- Node.js v18+ recommended
- Use pnpm as the package manager
- Expo SDK 52+
- Android 5.0+ and iOS 13+ support