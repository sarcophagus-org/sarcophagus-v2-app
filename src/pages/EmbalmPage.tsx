import { Flex } from '@chakra-ui/react';
import { Embalm } from '../features/embalm';

export function EmbalmPage() {
  return (
    <Flex
      direction="column"
      width="100%"
      maxWidth="1200px"
      height="%100"
      ml={{ xl: '84px', lg: '24px', md: '24px' }}
      mr={{ xl: '84px', lg: '24px', md: '24px' }}
    >
      <Embalm />
    </Flex>
  );
}
