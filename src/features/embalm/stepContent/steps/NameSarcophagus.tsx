import { VStack } from '@chakra-ui/react';
import { Resurrections } from '../components/Resurrections';
import { SarcophagusName } from '../components/SarcophagusName';

export function NameSarcophagus() {
  return (
    <VStack
      spacing={6}
      align="left"
      w="100%"
    >
      <SarcophagusName />
      <Resurrections pt={6} />
    </VStack>
  );
}
