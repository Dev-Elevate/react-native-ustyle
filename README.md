# react-native-ustyle [BETA]

Welcome to react-native-ustyle, a seamless drop-in replacement for React Native that supercharges your development experience. This library introduces configurable utility props for styling, hence the name (React Native UTILITY+STYLE), it enhances all React Native components without adding any runtime overhead. Moreover, it is fully typed, providing the benefits of type checking and autocompletion.

## Installation

```sh
npm install react-native-ustyle babel-plugin-react-native-ustyle --save-dev
```

**OR**

```sh
yarn add react-native-ustyle babel-plugin-react-native-ustyle -D
```

## Usage

```js
// App.tsx
import { Text, View } from 'react-native-ustyle';

export default function App() {
  return (
    <View bg={'$primary'} p={'$space$4'} mx={'$space$5'} mr="-$space$4">
      <Text c="$secondary">Open up App.js to start working on your app!</Text>
    </View>
  );
}
```

## Configuration

```ts
// rnu.config.ts
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
