import { VStack, Heading, Input, FormLabel, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRecoverPublicKey } from './useRecoverPublicKey';

export function RecoverPublicKey() {
  const [address, setAddress] = useState('');

  const { recoverPublicKey, publicKey, isLoading } = useRecoverPublicKey();

  async function handleOnClick(): Promise<void> {
    await recoverPublicKey(address);
  }

  return (
    <VStack align="left">
      <Heading>Lookup Public Key</Heading>
      <FormLabel>Etherum Address</FormLabel>
      <Input
        placeholder="0x0..."
        onChange={e => setAddress(e.currentTarget.value)}
        value={address}
        disabled={isLoading}
      />
      <Button
        background="gray"
        width={20}
        onClick={handleOnClick}
        isLoading={isLoading}
      >
        Submit
      </Button>
      <Text>Public Key:{publicKey}</Text>
    </VStack>
  );
}
