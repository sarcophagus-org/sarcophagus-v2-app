import { Flex } from '@chakra-ui/react';
import { Embalm } from '../features/embalm';

export function EmbalmPage() {
  return (
    <Flex
      direction="column"
      width="100%"
      h="100%"
    >
      <Embalm />
    </Flex>
  );
}
