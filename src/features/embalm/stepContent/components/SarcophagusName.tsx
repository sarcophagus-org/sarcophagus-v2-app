import { FormControl, FormLabel, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { useSarcophgusName } from '../hooks/useSarcophagusName';
import { maxSarcophagusNameLength } from 'lib/constants';

export function SarcophagusName() {
  const { name, handleNameChange } = useSarcophgusName();

  return (
    <VStack
      align="left"
      spacing={8}
    >
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          onChange={handleNameChange}
          value={name}
          maxLength={maxSarcophagusNameLength}
        />
        <Text
          mt={3}
          textAlign="left"
        >
          Your Sarcophagus will be public on the blockchain.
        </Text>
      </FormControl>
    </VStack>
  );
}
