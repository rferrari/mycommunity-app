import type { LucideIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Text } from 'react-native';

export function iconWithClassName(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });

  // Ensure text content is properly handled
  cssInterop(Text, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
        fontFamily: true,
        fontSize: true,
        fontWeight: true,
        lineHeight: true,
        letterSpacing: true,
        textAlign: true,
        textDecorationLine: true,
        textTransform: true,
      },
    },
  });
}
