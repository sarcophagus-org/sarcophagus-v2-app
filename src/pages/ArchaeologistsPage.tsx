import { Flex, Heading } from '@chakra-ui/react';
import { ArchaeologistList } from '../features/embalm/stepContent/components/ArchaeologistList';

export function ArchaeologistsPage() {
  return (
    <Flex
      w="100%"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Heading size="lg">Archaeologists</Heading>
      <ArchaeologistList includeDialButton={true} />
    </Flex>
  );
}
