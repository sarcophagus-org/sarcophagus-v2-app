import { Flex, Heading } from '@chakra-ui/react';
import { FundBundlr } from '../features/fundbundlr';

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
      <FundBundlr />
    </Flex>
  );
}
