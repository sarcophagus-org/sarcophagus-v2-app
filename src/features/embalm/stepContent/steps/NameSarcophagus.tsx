import { FormControl, FormLabel, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { maxSarcophagusNameLength } from 'lib/constants';
import React from 'react';
import { setName } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function NameSarcophagus() {
  const dispatch = useDispatch();
  const { name } = useSelector(x => x.embalmState);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.length > maxSarcophagusNameLength) {
      return;
    }
    dispatch(setName(value));
  }

  return (
    <VStack
      spacing={9}
      align="left"
      w="100%"
    >
      <Heading>Name your sarcophagus</Heading>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          onChange={handleNameChange}
          value={name}
          maxLength={maxSarcophagusNameLength}
        />
        <Text
          mt={3}
          textAlign="center"
        >
          Your Sarcophagus will be public on the blockchain.
        </Text>
      </FormControl>
    </VStack>
  );
}
