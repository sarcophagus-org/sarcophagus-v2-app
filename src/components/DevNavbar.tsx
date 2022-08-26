import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

export function DevNavbar({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      width="100%"
      backgroundColor="brand.50"
      alignItems="center"
      px={4}
    >
      <Text pr={4}>DEV NAVBAR</Text>
      {children}
    </Flex>
  );
}
