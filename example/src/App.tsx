import React from 'react';
import { VC } from 'react-native-ustyle';
const { Box, Center, Heading } = VC;
export default function App() {
  return (
    <Box
      bg={'$secondary'}
      p={8}
      mx={'$space$5'}
      mr="-$space$4"
      roundedBottom={8}
    >
      <Center>
        <Heading variant="primary">Hello World</Heading>
      </Center>
      <Heading c="red">Open up App.js to start working on your app!</Heading>
    </Box>
  );
}
