import { Center, Flex } from '@chakra-ui/react';
import { Sarcophagi } from 'features/sarcophagi';
import { SarcophagusDetail } from 'features/sarcophagi/components/SarcophagusDetail';
import { useParams } from 'react-router-dom';

export function DashboardPage() {
  const { id } = useParams();
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
        {!!id ? <SarcophagusDetail id={id} /> : <Sarcophagi />}
      </Flex>
    </Center>
  );
}
