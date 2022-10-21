import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { ReviewSarcohpagusTable } from './ReviewSarcophagusTable';
import { SarcohpagusSummaryFees } from './SarcohpagusSummaryFees';
import { SummaryErrorIcon } from './SummaryErrorIcon';

export function ReviewSarcophagus() {
  return (
    <VStack
      align="left"
      spacing={6}
      mt={4}
    >
      <Text>
        Review your details below. Once you are ready, you can submit your transactions. Be aware,
        you will make two transactions: (1) encrypt your payload, and (2) upload your payload to
        Arweave via Bundlr.
      </Text>

      <Flex
        flex={4}
        height="100%"
        direction="column"
      >
        <Box
          py={3}
          bgGradient="linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
        >
          <Text
            width="full"
            textAlign="center"
          >
            Sarcophagus Summary
          </Text>
        </Box>
        <ReviewSarcohpagusTable />
        <SarcohpagusSummaryFees />
        <Flex
          mt={3}
          alignItems="center"
        >
          <SummaryErrorIcon />
          <Text
            ml={2}
            color="brand.500"
          >
            = missing information
          </Text>
        </Flex>
      </Flex>
    </VStack>
  );
}
