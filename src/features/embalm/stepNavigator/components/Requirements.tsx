import { Flex, VStack, Text } from '@chakra-ui/react';
import React from 'react';

export function Requirements({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      bg="brand.100"
      overflowX="hidden"
      py={6}
      px={6}
    >
      <VStack
        align="left"
        spacing={3}
      >
        <Text>Requirements</Text>
        <VStack
          align="left"
          spacing={3}
        >
          {children}
        </VStack>
      </VStack>
    </Flex>
  );
}
