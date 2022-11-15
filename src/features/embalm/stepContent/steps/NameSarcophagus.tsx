import { VStack } from '@chakra-ui/react';
import { SetResurrection } from '../components/SetResurrection';
import { SarcophagusName } from '../components/SarcophagusName';

export function NameSarcophagus() {
  return (
    <VStack
      spacing={6}
      align="left"
      w="100%"
    >
      <SarcophagusName />
      <SetResurrection pt={6} />
    </VStack>
  );
}
