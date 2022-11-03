import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useSarcoModal } from 'components/SarcoModal';
import { ReviewSarcophagusTable } from './ReviewSarcophagusTable';
import { SarcophagusSummaryFees } from './SarcophagusSummaryFees';
import { SummaryErrorIcon } from './SummaryErrorIcon';

export function ReviewSarcophagus() {

  const { SarcoModal, openModal, closeModal } = useSarcoModal();

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
        <ReviewSarcophagusTable />
        <SarcophagusSummaryFees />
        <Flex
          onClick={openModal}
          mt={3}
          alignItems="center"
        >
          <SummaryErrorIcon />
          <Text
            ml={2}
            color="brand.500"
            textAlign={'center'}
          >
            = missing information
          </Text>
        </Flex>
        <SarcoModal
          isDismissible={false}
          coverImage={<Flex height={300} width={300} bgColor={'#777'} mb={10} />}
          title={<Text fontSize={'20px'} fontWeight={400} textAlign='center'>Download PDF</Text>}
          secondaryButton={{ label: 'Close', onClick: () => { }, dismissesModal: true }}
        >
          <Text fontSize={'14px'} textAlign='center'>Download and send this to your recipient. Do not store this online or let anyone see.</Text>
          <Box height={30} />
          <Button onClick={() => closeModal()}>
            Download
          </Button>
        </SarcoModal>
      </Flex>
    </VStack>
  );
}
