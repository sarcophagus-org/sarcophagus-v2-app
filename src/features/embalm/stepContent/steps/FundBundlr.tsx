import { QuestionIcon } from '@chakra-ui/icons';
import { Text, VStack, Box, Link, Spacer } from '@chakra-ui/react';
import { Bundlr } from '../components/Bundlr';
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
        Bundlr will package your payload and send to Arweave. Upload fees are paid from your Bundlr
        balance which is funded with ETH.
        <Spacer />
        <Link
          color="brand.950"
          href="https://bundlr.network/"
          isExternal
        >
          <QuestionIcon />
        </Link>
      </Text>

      <Bundlr>
        <Box py={3}>
          <BundlrAlertMessage />
        </Box>
      </Bundlr>
    </VStack>
  );
}
