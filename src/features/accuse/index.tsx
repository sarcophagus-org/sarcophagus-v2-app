import { Button, Flex, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { useAccuse } from 'hooks/thirdPartyFacet/useAccuse';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { PrivateKeyInput } from './PrivateKeyInput';
import { useAccusedWallets } from './useAccusedWallets';

export function Accuse() {
  const [sarcophagusId, setSarcophagusId] = useState('');
  const [archaeologistPrivateKeys, setArchaeologistPrivateKeys] = useState<string[]>(['']);
  const [paymentAddressOverride, setPaymentAddressOverride] = useState('');

  const { address: paymentAddress } = useAccount();

  // Sign the messages using the private keys whenever the form is provided valid values
  const { signatures, publicKeys } = useAccusedWallets(
    sarcophagusId,
    archaeologistPrivateKeys,
    paymentAddress
  );

  const { accuse, mayFail, isError, isAccusing, isLoading, isSuccess, isEnabled } = useAccuse(
    sarcophagusId,
    publicKeys,
    signatures,
    paymentAddress
  );

  function handleChangeSarcophagusId(e: React.ChangeEvent<HTMLInputElement>) {
    setSarcophagusId(e.target.value);
  }

  function handleAddPrivateKey() {
    setArchaeologistPrivateKeys(prev => [...prev, '']);
  }

  function handleRemovePrivateKey(index: number) {
    const newArchaeologistPrivateKeys = [...archaeologistPrivateKeys];
    newArchaeologistPrivateKeys.splice(index, 1);

    // if there are no archaeologist private keys left, add an empty one
    if (newArchaeologistPrivateKeys.length === 0) {
      newArchaeologistPrivateKeys.push('');
      setArchaeologistPrivateKeys(['']);
    } else {
      setArchaeologistPrivateKeys(newArchaeologistPrivateKeys);
    }
  }

  function handleChangePrivateKey(e: React.ChangeEvent<HTMLTextAreaElement>, index: number) {
    const newArchaeologistPrivateKeys = [...archaeologistPrivateKeys];
    newArchaeologistPrivateKeys[index] = e.target.value.trim();
    setArchaeologistPrivateKeys(newArchaeologistPrivateKeys);
  }

  function handleChangePaymentAddress(e: React.ChangeEvent<HTMLInputElement>) {
    setPaymentAddressOverride(e.target.value);
  }

  function handleAccuse() {
    accuse();
  }

  // Reset the form when the accuse transaction is successful
  useEffect(() => {
    if (isSuccess) {
      setSarcophagusId('');
      setArchaeologistPrivateKeys(['']);
      setPaymentAddressOverride('');
    }
  }, [isSuccess, setArchaeologistPrivateKeys]);

  return (
    <Flex
      w="100%"
      direction="column"
      pr={50}
    >
      <Text fontSize="2xl">Accusals</Text>
      <Text
        mt={3}
        variant="secondary"
      >
        If you found a private key an archaeologist has leaked, you can accuse them on this page.
        Please enter the Sarcophagus ID and the archaeologist private key as evidence.
      </Text>
      <FormControl>
        <FormLabel mt={12}>Sarcophagus ID</FormLabel>
        <Input
          placeholder="0x000..."
          value={sarcophagusId}
          onChange={handleChangeSarcophagusId}
          mt={1}
          p={6}
        />
        <FormLabel
          mt={12}
          mb={1}
        >
          Archaeologist Private Key
        </FormLabel>
        <>
          {archaeologistPrivateKeys.map((privateKey, index) => (
            <PrivateKeyInput
              key={index}
              value={privateKey}
              onChange={e => handleChangePrivateKey(e, index)}
              onClickAddButton={handleAddPrivateKey}
              onClickRemoveButton={() => handleRemovePrivateKey(index)}
              showAddButton={index === archaeologistPrivateKeys.length - 1}
              hideRemoveButton={
                archaeologistPrivateKeys.length === 1 && archaeologistPrivateKeys[0] === ''
              }
            />
          ))}
        </>
        <Text mt={3}>
          To accuse multiple achaeologists, click the plus sign to the right of the field.
        </Text>
        <FormLabel mt={12}>Send payment to a different wallet</FormLabel>
        <Input
          placeholder="Wallet address or ENS name"
          mt={1}
          p={6}
          value={paymentAddressOverride}
          onChange={handleChangePaymentAddress}
        />
        <Text mt={2}>Leave this blank if you want funds send to the connected wallet.</Text>
        <Button
          mt={12}
          px={6}
          disabled={!isEnabled || mayFail || signatures.length !== archaeologistPrivateKeys.length}
          onClick={handleAccuse}
          isLoading={!isError && (isLoading || isAccusing)}
        >
          Accuse
        </Button>
      </FormControl>
    </Flex>
  );
}
