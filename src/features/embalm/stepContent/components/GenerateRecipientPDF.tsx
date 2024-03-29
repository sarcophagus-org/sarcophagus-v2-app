import { VStack, Button, Text, Textarea, Link } from '@chakra-ui/react';
import { useGenerateRecipientPDF } from '../hooks/useGenerateRecipientPDF';
import { GeneratePDFState } from 'store/embalm/actions';
import { useSelector } from 'store/index';
import { SarcoAlert } from 'components/SarcoAlert';

export function GenerateRecipientPDF() {
  const { generatePublicKey, downloadRecipientPDF, isLoading, generateError } =
    useGenerateRecipientPDF();

  const { recipientState } = useSelector(x => x.embalmState);
  const generateStateMap = {
    [GeneratePDFState.UNSET]: (
      <VStack
        align="left"
        spacing={4}
      >
        <Button
          width="fit-content"
          onClick={generatePublicKey}
          isLoading={isLoading}
        >
          Generate a new public key
        </Button>
        <Text>
          When you click this, it will generate a new wallet and public key. Send the downloadable
          PDF to the recipient.
        </Text>
        {generateError && (
          <SarcoAlert
            status="error"
            title="Error while generating"
          >
            {generateError}
          </SarcoAlert>
        )}
      </VStack>
    ),
    [GeneratePDFState.GENERATED]: (
      <VStack
        border="1px solid"
        p={6}
        spacing={6}
        w="400px"
      >
        <Text fontSize="xl">Download PDF</Text>
        <Text align="center">
          Download and send this to your recipient. Do not store this online or let anyone see it.
        </Text>
        <Button
          w="100%"
          onClick={downloadRecipientPDF}
        >
          Download
        </Button>
      </VStack>
    ),
    [GeneratePDFState.DOWNLOADED]: (
      <VStack
        spacing={6}
        w="100%"
      >
        <Textarea
          disabled
          value={recipientState.publicKey}
          resize="none"
        />
        <SarcoAlert
          status="success"
          title="Recipient Key Created!"
        >
          You can continue to the next step.{' '}
          <Link
            textDecor="underline"
            onClick={downloadRecipientPDF}
          >
            Make sure you downloaded the PDF.
          </Link>
        </SarcoAlert>
      </VStack>
    ),
  };

  return (
    <VStack spacing={0}>
      {generateStateMap[recipientState.generatePDFState || GeneratePDFState.UNSET]}
    </VStack>
  );
}
