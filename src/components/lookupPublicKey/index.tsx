import { VStack, Heading, Input, FormLabel, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useLookupPublicKey, LookupPublicKeyStatus } from './useLookupPublicKey';

export function LookupPublicKey() {
  const [address, setAddress] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const { lookupPublicKey, lookupStatus } = useLookupPublicKey();

  const getLookupStatusMessage = (status: LookupPublicKeyStatus | null): string => {
    switch (status) {
      case LookupPublicKeyStatus.SUCCESS:
        return 'Successfully retrieved public key';
      case LookupPublicKeyStatus.ERROR:
        return 'Error retrieving public key';
      case LookupPublicKeyStatus.NO_TRANSACTIONS:
        return 'No transactions available, cannot lookup public key';
      case LookupPublicKeyStatus.LOADING:
        return 'Loading...';
      case LookupPublicKeyStatus.INVALID_ADDRESS:
        return 'Invalid address';
      case LookupPublicKeyStatus.NOT_CONNECTED:
        return 'Wallet not connected';
      case LookupPublicKeyStatus.WRONG_NETWORK:
        return 'Wallet connected to incorrect network';
      default:
        return '';
    }
  };

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
      <Text>Status:{getLookupStatusMessage(lookupStatus)}</Text>
      <Text>Public Key:{publicKey}</Text>
    </VStack>
  );
}
