import { Flex } from '@chakra-ui/react';
import { AdminSarcophagi } from 'features/sarcophagi/components/AdminSarcophagi';

export function AdminDashBoardPage() {
  return (
    <Flex justify="center">
      <Flex
        w={775}
        mt={12}
        mb="84px"
      >
        <AdminSarcophagi />
      </Flex>
    </Flex>
  );
}
