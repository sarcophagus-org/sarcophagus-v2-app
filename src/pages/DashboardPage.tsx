import { Flex } from '@chakra-ui/react';
import { Sarcophagi } from 'features/sarcophagi';

export function DashboardPage() {
  return (
    <Flex
      width="100%"
      justify="center"
      overflow="hidden"
    >
      {/* Container that controls the size of the sarcophagi list*/}
      <Flex
        w="75%"
        mt="50px"
        mb="75px"
        maxWidth="1200px"
        minWidth="800px"
        minHeight="400px"
      >
        <Sarcophagi />
      </Flex>
    </Flex>
  );
}
