import { Text, VStack, Box } from '@chakra-ui/react';
import { Bundlr } from '../../../../../src/components/Bundlr';
import { BundlrAlertMessage } from '../components/BundlrAlertMessage';

export function FundBundlr() {
  return (
    <VStack
      align="left"
      w="100%"
    >
      <Text
        mb={6}
        variant="secondary"
      >
        Bundlr will package your payload and send to Arweave using Ethereum.
      </Text>

      <Bundlr>
        <Box py={3}>
          <BundlrAlertMessage />
        </Box>
      </Bundlr>
    </VStack>
  );
}
