import { createConfig } from 'react-native-ustyle';
export const CONFIG = createConfig({
  aliases: {
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
    mr: 'marginRight',
    roundedTop: ['borderTopLeftRadius', 'borderTopRightRadius'],
    roundedBottom: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    roundedLeft: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
    roundedRight: ['borderTopRightRadius', 'borderBottomRightRadius'],
  },
  tokens: {
    global: {
      primary: '#0000FF',
      secondary: '#FFFF00',
    },
    space: {
      'px': 1,
      '1': 4,
      '2': 8,
      '3': 12,
      '4': 16,
      '5': 20,
      '6': 24,
      '7': 28,
    },
  },
} as const);

type ConfigType = typeof CONFIG;

declare module 'react-native-ustyle' {
  interface ICustomConfig extends ConfigType {}
}
