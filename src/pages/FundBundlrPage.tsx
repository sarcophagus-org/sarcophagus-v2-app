import { Flex, Heading, Text } from '@chakra-ui/react';
import { Bundlr } from '../../src/components/Bundlr';
import { WithdrawBalance } from '../components/WithdrawBalance';

export function FundBundlrPage() {
  return (
    <Flex
      direction="column"
      maxWidth={640}
      w="90%"
      ml="5%"
      py="48px"
    >
      <Heading>Fund/Withdraw from Arweave Bundlr</Heading>
      <Text
        mb={6}
        variant="secondary"
      >
        Add and/or withdraw funds from Bundlr to package your payload and send to Arweave using
        Ethereum.
      </Text>
      <Bundlr>
        <WithdrawBalance />
      </Bundlr>
    </Flex>
  );
}
