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
        Bundlr is responsible for uploading your file payload to Arweave. You must have enough
        Bundlr balance to upload the payload. You can connect to Bundlr and fund your account below
        or on the Bundlr page in the main menu.
        <Spacer />
        <Link
          color="brand.950"
          href="https://bundlr.network/"
          isExternal
        >
          Learn more
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
