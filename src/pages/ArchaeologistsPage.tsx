import { Flex, Heading } from '@chakra-ui/react';
import { SelectArchaeologists } from '../features/embalm/stepContent/steps/SelectArchaeologists';

export function ArchaeologistsPage() {
  return (
    <Flex
      w="60%"
      mt="30px"
      ml="70px"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Heading
        size="lg"
        mb={'30px'}
      >
        Archaeologists
      </Heading>
      <SelectArchaeologists />
    </Flex>
  );
}
