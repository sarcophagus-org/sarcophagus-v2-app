import { Flex, Heading, Text } from '@chakra-ui/react';
import { sumDiggingFees } from 'lib/utils/helpers';
import { useSelector } from 'store/index';
import { ArchaeologistList } from '../components/ArchaeologistList';

export function SelectArchaeologists() {
  const { selectedArchaeologists } = useSelector(x => x.embalmState);

  return (
    <Flex
      direction="column"
      width="100%"
    >
      <Heading>Select Archaeologists</Heading>
      <Text variant="secondary">Selected archaeologists: {selectedArchaeologists.length}</Text>
      <Text variant="secondary">
        Total digging fee {sumDiggingFees(selectedArchaeologists).toString()} SARCO.
      </Text>
      <ArchaeologistList />
    </Flex>
  );
}
