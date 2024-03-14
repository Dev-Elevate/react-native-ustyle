import React from 'react';
import { Text, View, VC } from 'react-native-ustyle';
const { Box, Center, Heading } = VC;
export default function App() {
  return (
    <View
      bg={'$secondary'}
      p={8}
      mx={'$space$5'}
      mr="-$space$4"
      roundedBottom={8}
    >
      <Box></Box>
      <Center>
        <Heading variant="primary">Hello World</Heading>
      </Center>
      <Text c="$secondary">Open up App.js to start working on your app!</Text>
    </View>
  );
}
