import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

export function DevNavbar({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      width="100%"
      height={50}
      backgroundColor="#202226"
      boxShadow={'0px 0px 10px rgba(0, 0, 0, 0.5)'}
      alignItems="center"
      px={4}
    >
      <Text
        pr={4}
        color="#777"
      >
        DEV NAVBAR
      </Text>
      {children}
    </Flex>
  );
}
