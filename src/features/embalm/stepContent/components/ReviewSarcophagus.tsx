import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { ReviewSarcophagusTable } from './ReviewSarcophagusTable';
import { SarcophagusSummaryFees } from './SarcophagusSummaryFees';
import { SummaryErrorIcon } from './SummaryErrorIcon';

export function ReviewSarcophagus() {
  const { sarcophagusParameters } = useSarcophagusParameters();

  return (
    <VStack
      align="left"
      spacing={6}
      mt={4}
    >
      <Text>
        Review your details below. Once you are ready, you can submit your transactions. Be aware,
        you will make multiple transactions.
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
        <ReviewSarcophagusTable sarcophagusParameters={sarcophagusParameters} />
        <SarcophagusSummaryFees />
        {sarcophagusParameters.some(p => p.error) && (
          <Flex
            mt={3}
            alignItems="center"
          >
            <SummaryErrorIcon />
            <Text
              variant="secondary"
              fontSize="xs"
              ml={2}
              textAlign={'center'}
            >
              = missing information
            </Text>
          </Flex>
        )}
      </Flex>
    </VStack>
  );
}
