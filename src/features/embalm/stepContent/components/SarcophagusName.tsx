import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { useSarcophgusName } from '../hooks/useSarcophagusName';
import { maxSarcophagusNameLength } from 'lib/constants';

export function SarcophagusName() {
  const { name, handleNameChange } = useSarcophgusName();

  return (
    <VStack
      align="left"
      spacing={8}
      mt={6}
    >
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          onChange={handleNameChange}
          autoFocus
          value={name}
          maxLength={maxSarcophagusNameLength}
        />
      </FormControl>
    </VStack>
  );
}
