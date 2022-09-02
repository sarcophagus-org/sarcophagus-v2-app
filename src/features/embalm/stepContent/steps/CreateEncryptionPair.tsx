import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
  Text,
  Textarea,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { copyToClipboardTimeout } from 'lib/constants';
import { copiedToClipboard } from 'lib/utils/toast';
import { useCreateEncryptionKeypair } from '../hooks/useCreateEncryptionKeypair';

export function CreateEncryptionKeypair() {
  const { outerPublicKey, isLoading, createEncryptionKeypair } = useCreateEncryptionKeypair();
  const { hasCopied, onCopy } = useClipboard(outerPublicKey || '', {
    timeout: copyToClipboardTimeout,
  });
  const toast = useToast();

  function handleCopy() {
    toast(copiedToClipboard());
    onCopy();
  }

  async function handleCreateKeypairManually() {
    await createEncryptionKeypair();
  }

  return (
    <Flex direction="column">
      <Heading>Create Encryption keypair</Heading>
      <Text
        mt={3}
        variant="secondary"
      >
        A public and private key pair have been generated. This public key will be used to perform
        the second encryption on the payload.
      </Text>
      <FormControl
        h="150px"
        mt={6}
      >
        {isLoading ? (
          <Center my={12}>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormLabel>Public key</FormLabel>
            <Flex>
              <Textarea
                h="100px"
                py={4}
                value={outerPublicKey || ''}
                readOnly
              />
              <Button
                ml={6}
                textDecor="underline"
                variant="link"
                onClick={handleCopy}
              >
                {hasCopied ? 'Copied' : 'Copy'}
              </Button>
            </Flex>
            <Center mt={6}>
              <Button
                textDecor="underline"
                variant="link"
                onClick={handleCreateKeypairManually}
              >
                Generate new keypair
              </Button>
            </Center>
          </>
        )}
      </FormControl>
    </Flex>
  );
}
