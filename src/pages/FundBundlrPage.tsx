import { Flex, Heading } from '@chakra-ui/react';
import { FundBundlr } from '../features/fundbundlr/FundBundlr';

export function FundBundlrPage() {
  return (
    <Flex
      direction="column"
      width="70%"
      height="%100"
      p="80px"
    >
      <Heading>Fund Arweave Bundlr</Heading>
      <FundBundlr />
    </Flex>
  );
}
