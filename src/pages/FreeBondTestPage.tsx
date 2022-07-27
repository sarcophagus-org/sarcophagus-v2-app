import { VStack } from '@chakra-ui/react';
import DepositFreeBond from '../components/DepositFreeBond';
import DisplayFreeBond from '../components/DisplayFreeBond';

function FreeBondTestPage() {
  return (
    <VStack>
      <DepositFreeBond />
      <DisplayFreeBond />
    </VStack>
  );
}

export default FreeBondTestPage;
