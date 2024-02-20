import { createConfig } from 'react-native-ustyle';
export const CONFIG = createConfig({
  p: 'padding',
  m: 'margin',
  t: 'top',
  b: 'bottom',
  l: 'left',
  r: 'right',
  h: 'height',
  w: 'width',
  bg: 'backgroundColor',
  c: 'color',
  mx: 'marginHorizontal',
  bc: 'borderColor',
  bw: 'borderWidth',
} as const);

type ConfigType = typeof CONFIG;

declare module 'react-native-ustyle' {
  interface ICustomConfig extends ConfigType {}
}
