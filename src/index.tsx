export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

import type { ViewProps, TextProps } from 'react-native';

export interface ExtendedComponentProps {
  p?: number;
  w?: number;
  h?: number;
  bg?: string;
  // ...
}

export type ExtendedViewProps = ViewProps & ExtendedComponentProps;
export type ExtendedTextProps = TextProps & ExtendedComponentProps;

export function View(_props: ExtendedViewProps) {
  return null;
}

export function Text(_props: ExtendedTextProps) {
  return null;
}
