import {
  VStack,
  Button,
  Text,
  Image,
  Textarea,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useGenerateRecipientPDF } from '../hooks/useGenerateRecipientPDF';
import { GeneratePDFState } from 'store/embalm/actions';
import { useSelector } from 'store/index';
import { Alert } from 'components/Alert';
import CursePdfSvg from 'assets/images/curse-pdf.svg';

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
          <Alert status="error">
            <AlertTitle>Error while generating</AlertTitle>
            <AlertDescription>{generateError}</AlertDescription>
          </Alert>
        )}
      </VStack>
    ),
    [GeneratePDFState.GENERATED]: (
      <VStack
        bg="brand.100"
        p={6}
        spacing={6}
        w="400px"
      >
        <Image
          src={CursePdfSvg}
          h="200px"
        />
        <Text>Download PDF</Text>
        <VStack
          p={6}
          border="1px solid"
          borderColor="violet.700"
          bgGradient="linear(to-b, brand.100, brand.200)"
          spacing="4"
        >
          <Text align="center">
            Download and send this to your recipient. Do not store this online or let anyone see.
          </Text>
          <Button
            w="100%"
            onClick={downloadRecipientPDF}
          >
            Download
          </Button>
        </VStack>
      </VStack>
    ),
    [GeneratePDFState.DOWNLOADED]: (
      <VStack spacing={6}>
        <Textarea
          disabled
          value={recipientState.publicKey}
          resize="none"
        />
        <Alert status="success">
          <AlertTitle> Recipient Key Created!</AlertTitle>
          <AlertDescription>
            <Text as="span"> You can continue to the next step. </Text>
            <Button
              as="span"
              variant="link"
              onClick={downloadRecipientPDF}
              cursor="pointer"
            >
              Make sure you downloaded the PDF.
            </Button>
          </AlertDescription>
        </Alert>
      </VStack>
    ),
  };

  return (
    <VStack spacing={0}>
      {generateStateMap[recipientState.generatePDFState || GeneratePDFState.UNSET]}
    </VStack>
  );
}
