import { Text, Button, Flex, Heading } from '@chakra-ui/react';
import { Alert } from 'components/Alert';
import { useCreateSarcophagus } from '../hooks/useCreateSarcohpagus';

export function CreateSarcophagus() {
  const { handleSubmit, isUploading, canCreateSarcophagus, payloadTxId, shardsTxId } =
    useCreateSarcophagus();

  return (
    <Flex
      direction="column"
      w="100%"
    >
      <Heading>Create Sarcophagus</Heading>
      <Alert
        mt={6}
        status="info"
      >
        This is a temporary interface
      </Alert>
      <Text mt={3}>Clicking the Upload Payload button will </Text>
      <Text ml={3}>
        1. Encrypt the inner layer of the payload using the recipient{"'"}s public key
      </Text>
      <Text ml={3}>2. Encrypt the outer layer of the payload using the generated public key</Text>
      <Text ml={3}>3. Split the outer layer private key using Shamirs Secret Sharing</Text>
      <Text ml={3}>4. Encrypt each shard with each archaeologist{"'"}s public key</Text>
      <Text ml={3}>5. Upload the double encrypted payload to the Arweave Bundlr</Text>
      <Text ml={3}>6. Upload the encrypted shards to the Arweave Bundlr</Text>
      <Text mt={3}>Steps before upload (for testing):</Text>
      <Text ml={3}>1. Upload a payload</Text>
      <Text ml={3}>2. Fund the Bundlr (you may need to reconnect to the Bundlr)</Text>
      <Text ml={3}>3. Set a recipient</Text>
      <Text ml={3}>4. Create Encryption Keypair</Text>
      <Text mt={3}>Payload txId: {payloadTxId} </Text>
      <Text>Shards txId: {shardsTxId} </Text>
      <Button
        mt={6}
        onClick={handleSubmit}
        isLoading={isUploading}
        disabled={isUploading || !canCreateSarcophagus}
      >
        Upload Payload
      </Button>
    </Flex>
  );
}
