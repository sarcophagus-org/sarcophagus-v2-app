import { Flex, Heading, Text } from '@chakra-ui/react';
import { sumDiggingFees } from 'lib/utils/helpers';
import { useSelector } from 'store/index';
import { ArchaeologistList } from '../components/ArchaeologistList';
import { ArchaeologistHeader } from '../components/ArchaeologistHeader';

export function SelectArchaeologists() {
  const { selectedArchaeologists } = useSelector(x => x.embalmState);

  return (
    <Flex
      direction="column"
      width="100%"
    >
      <Heading>Select Archaeologists</Heading>
      <Text
        variant="primary"
        mt="6"
      >
        Resurrection Time
      </Text>
      <Text
        variant="primary"
        mt="2"
      >
        Currently set: 09.22.22 7:30pm (edit)
      </Text>
      <ArchaeologistHeader></ArchaeologistHeader>
      <ArchaeologistList />
    </Flex>
  );
}
