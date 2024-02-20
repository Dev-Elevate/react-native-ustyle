# react-native-ustyle

Easy and configurable utiltity styling props support for React Native

## Installation

```sh
npm install react-native-ustyle
```

## Usage

```js
// App.tsx
import { Text, View } from 'react-native-ustyle';

export default function App() {
  return (
    <View bc="red" bw={2} bg="yellow" p={90} mx={20}>
      <Text c="blue">Open up App.tsx to start working on your app!</Text>
    </View>
  );
}
```

## Configuration

```ts
// rnu.config.ts
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
