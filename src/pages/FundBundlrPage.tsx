import { Flex, Heading, Text, FormLabel } from '@chakra-ui/react';
import { Bundlr } from '../../src/components/Bundlr';
import { WithdrawBalance } from '../components/WithdrawBalance';

export function FundBundlrPage() {
  return (
    <Flex
      direction="column"
      width="60%"
      height="%100"
      ml="84px"
      py="48px"
    >
      <Heading>Fund Arweave Bundlr</Heading>
      <Text
        mb={6}
        variant="secondary"
      >
        Add funds to Bundlr to package your payload and send to Arweave using Ethereum.
      </Text>
      <Bundlr>
        <WithdrawBalance />
      </Bundlr>
    </Flex>
  );
}
