import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { Bundlr } from '../components/Bundlr';
import { BundlrAlertMessage } from '../components/BundlrAlertMessage';
import { useNetwork } from 'wagmi';
import { QuestionIcon } from '@chakra-ui/icons';

export function FundBundlr() {
  const { chain } = useNetwork();

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
            Bundlr balance which is funded with {chain?.nativeCurrency?.name || 'ETH'}.
          </Text>
          <Box
            ml={1}
            as="span"
          >
            <a
              color="brand.950"
              href="https://irys.xyz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <QuestionIcon />
            </a>
          </Box>
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
