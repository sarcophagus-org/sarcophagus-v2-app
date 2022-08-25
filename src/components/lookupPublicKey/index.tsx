import { VStack, Heading, Input, FormLabel, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useLookupPublicKey, LookupPublicKeyStatus } from './useLookupPublicKey';

const LookupPublicKeyStatusMessageMap = new Map([
  [null, ''].
  [LookupPublicKeyStatus.SUCCESS, 'Successfully retrieved public key'],
  [LookupPublicKeyStatus.ERROR, 'Error retrieving public key'],
  [LookupPublicKeyStatus.NO_TRANSACTIONS, 'No transactions available, cannot lookup public key'],
  [LookupPublicKeyStatus.LOADING, 'Loading...'],
  [LookupPublicKeyStatus.INVALID_ADDRESS, 'Invalid address'],
  [LookupPublicKeyStatus.NOT_CONNECTED, 'Wallet not connected'],
  [LookupPublicKeyStatus.WRONG_NETWORK, 'Wallet connected non-supported network'],
]);

export function LookupPublicKey() {
  const [address, setAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const { lookupPublicKey, lookupStatus } = useLookupPublicKey();

  async function handleOnClick(): Promise<void> {
    const pk = await lookupPublicKey(address);
    setPublicKey(pk || 'not found');
  }

  return (
    <VStack align="left">
      <Heading>Lookup Public Key</Heading>
      <FormLabel>Etherum Address</FormLabel>
      <Input
        placeholder="0x0..."
        onChange={e => setAddress(e.currentTarget.value)}
        value={address}
      />
      <Button
        background="gray"
        width={20}
        onClick={handleOnClick}
      >
        Submit
      </Button>
      <Text>Status:{LookupPublicKeyStatusMessageMap.get(lookupStatus)}</Text>
      <Text>Public Key:{publicKey}</Text>
    </VStack>
  );
}
