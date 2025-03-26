import React from 'react';
import { Text, View } from 'react-native';

export function CssTextProvider({ children }: { children: React.ReactNode }) {
  const wrapTextContent = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string' || typeof node === 'number') {
      return <Text>{node}</Text>;
    }

    if (React.isValidElement(node)) {
      if (node.type === View && React.Children.count(node.props.children) > 0) {
        return React.cloneElement(node, {
          ...node.props,
          children: React.Children.map(node.props.children, child => wrapTextContent(child)),
        });
      }
    }

    return node;
  };

  return <>{wrapTextContent(children)}</>;
}