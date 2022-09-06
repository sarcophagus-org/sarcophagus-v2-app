import { Flex, Image, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export function SarcoAmount({ children }: { children: ReactNode }) {
  return (
    <Flex flexWrap="wrap">
      <Text mb={2}>Digging Fees:</Text>
      <Flex>
        <Image
          ml="0.5rem"
          w="18px"
          h="18px"
          mr="0.5rem"
          src="sarco-token-icon.png"
          float="left"
        />
        {children}
      </Flex>
    </Flex>
  );
  //
}
