const CONFIG = {
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
} as const;

type ConfigType = typeof CONFIG;

declare module 'react-native-ustyle' {
  interface ExtendedComponentProps extends ConfigType {}
}
