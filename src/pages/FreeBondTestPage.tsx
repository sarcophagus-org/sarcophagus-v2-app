import { VStack } from '@chakra-ui/react';
import DepositFreeBond from '../features/archaeologist/components/DepositFreeBond';
import DisplayFreeBond from '../features/archaeologist/components/DisplayFreeBond';

export function FreeBondTestPage() {
  return (
    <VStack>
      <DepositFreeBond />
      <DisplayFreeBond />
    </VStack>
  );
}
