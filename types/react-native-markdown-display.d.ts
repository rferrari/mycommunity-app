declare module 'react-native-markdown-display' {
  import { ReactNode } from 'react';
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  interface MarkdownProps {
    children: string;
    style?: {
      [key: string]: StyleProp<ViewStyle | TextStyle>;
    };
    mergeStyle?: boolean;
    rules?: object;
  }

  export default function Markdown(props: MarkdownProps): ReactNode;
}