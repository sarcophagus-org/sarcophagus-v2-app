import { VStack } from '@chakra-ui/react';
import { Resurrection } from '../components/Resurrection';
import { SarcophagusName } from '../components/SarcophagusName';

export function NameSarcophagus() {
  return (
    <VStack
      spacing={6}
      align="left"
      w="100%"
    >
      <SarcophagusName />
      <Resurrection pt={6} />
    </VStack>
  );
}
