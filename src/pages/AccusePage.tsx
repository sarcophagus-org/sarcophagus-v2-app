import { Flex } from '@chakra-ui/react';
import { Accuse } from 'features/accuse';

export function AccusePage() {
  return (
    <Flex justify="center">
      <Flex
        w={775}
        mt={12}
        mb="84px"
      >
        <Accuse />
      </Flex>
    </Flex>
  );
}
