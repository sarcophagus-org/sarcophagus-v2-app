import { Flex, Heading, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useSelector } from 'store/index';
import { ArchaeologistList } from '../components/ArchaeologistList';

export function SelectArchaeologists() {
  const { selectedArchaeologists, totalArchaeologists } = useSelector(x => x.embalmState);

  const selectionsLeft = parseInt(totalArchaeologists) - selectedArchaeologists.length;
  const totalDiggingFees = selectedArchaeologists.reduce(
    (acc, curr) => acc.add(curr.profile.minimumDiggingFee),
    BigNumber.from('0')
  );

  return (
    <Flex
      direction="column"
      width="100%"
    >
      <Heading>Select Archaeologists</Heading>
      <Text
        mt={3}
        variant="secondary"
      >
        Total archaeologists needed: {totalArchaeologists}
      </Text>
      <Text variant="secondary">Selected archaeologists: {selectedArchaeologists.length}</Text>
      <Text variant="secondary">
        Archaeologists left to select: {selectionsLeft > 0 ? selectionsLeft : 0}
      </Text>
      <Text variant="secondary">Total digging fee {totalDiggingFees.toString()} SARCO.</Text>
      <ArchaeologistList />
    </Flex>
  );
}
