import { Flex } from '@chakra-ui/react';
import { Dashboard } from '../features/dashboard';

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
