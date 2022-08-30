import { FormControl, FormLabel, Heading, Input, VStack } from '@chakra-ui/react';
import React from 'react';
import { setName, setRecipientKey } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function NameSarcophagus() {
  const dispatch = useDispatch();
  const { name, recipientPublicKey } = useSelector(x => x.embalmState);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    dispatch(setName(value));
  }

  function handleRecipientKeyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    dispatch(setRecipientKey(value));
  }

  return (
    <VStack
      spacing={9}
      align="left"
      w="100%"
    >
      <Heading>Name sarcophagus</Heading>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          onChange={handleNameChange}
          value={name}
        />
        <FormLabel mt={6}>Recipient Public Key</FormLabel>
        <Input
          onChange={handleRecipientKeyChange}
          value={recipientPublicKey}
        />
      </FormControl>
    </VStack>
  );
}
