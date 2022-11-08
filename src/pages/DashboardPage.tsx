import { Center, Flex } from '@chakra-ui/react';
import { Sarcophagi } from '../features/sarcophagi';

export function DashboardPage() {
  return (
    <Center
      width="100%"
      height="100%"
    >
      {/* Container that controls the size of the sarcophagi list*/}
      <Flex
        w="75%"
        h="75%"
        maxWidth="1200px"
        minWidth="800px"
        minHeight="400px"
      >
        <Sarcophagi />
      </Flex>
    </Center>
  );
}
