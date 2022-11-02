import { Flex, Heading, Text } from '@chakra-ui/react';
import { Bundlr } from '../../src/components/Bundlr';

export function FundBundlrPage() {
  return (
    <Flex
      direction="column"
      maxWidth={640}
      w="90%"
      ml="5%"
      py="48px"
    >
      <Heading>Fund Arweave Bundlr</Heading>
      <Text
        mb={6}
        variant="secondary"
      >
        Add funds to Bundlr to package your payload and send to Arweave using Ethereum.
      </Text>
      <Bundlr />
    </Flex>
  );
}
