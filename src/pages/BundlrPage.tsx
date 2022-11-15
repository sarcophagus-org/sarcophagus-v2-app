import { Flex } from '@chakra-ui/react';
import { Bundlr } from 'features/bundlr';

export function BundlrPage() {
  return (
    // Container that fills the entire page
    <Flex
      w="100%"
      justify="center"
    >
      {/* Container that fits the bundlr component */}
      <Flex
        h="fit-content"
        w="550px"
        mt="120px"
        justify="center"
      >
        <Bundlr />
      </Flex>
    </Flex>
  );
}
