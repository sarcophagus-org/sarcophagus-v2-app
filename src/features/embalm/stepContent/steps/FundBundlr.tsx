import { QuestionIcon } from '@chakra-ui/icons';
import { Box, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { Bundlr } from '../components/Bundlr';
import { BundlrAlertMessage } from '../components/BundlrAlertMessage';

export function FundBundlr() {
  return (
    <VStack
      align="left"
      w="100%"
    >
      <Flex>
        <Box
          as="span"
          display="inline"
        >
          <Text
            as="span"
            mb={6}
            variant="secondary"
          >
            Bundlr will package your payload and send to Arweave. Upload fees are paid from your
            Bundlr balance which is funded with ETH.
          </Text>
          <Link
            ml={1}
            as="span"
            color="brand.950"
            href="https://bundlr.network/"
            isExternal
          >
            <QuestionIcon />
          </Link>
        </Box>
      </Flex>

      <Bundlr>
        <Box py={3}>
          <BundlrAlertMessage />
        </Box>
      </Bundlr>
    </VStack>
  );
}
