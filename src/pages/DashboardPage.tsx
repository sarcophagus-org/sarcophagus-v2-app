import { Flex } from '@chakra-ui/react';
import { Dashboard } from '../features/dashboard';
import { useParams } from 'react-router-dom';

export function DashboardPage() {
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
    >
      <Dashboard />
    </Flex>
  );
}
