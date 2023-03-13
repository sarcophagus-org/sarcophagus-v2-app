import { Flex, Heading } from '@chakra-ui/react';
import { SelectArchaeologists } from '../features/embalm/stepContent/steps/SelectArchaeologists';
import { SarcoAlert } from '../components/SarcoAlert';

export function ArchaeologistsPage() {
  return (
    <Flex
      w="60%"
      mt="30px"
      ml="70px"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <SarcoAlert
        mb={6}
        status="warning"
      >
        This page is incomplete / experimental.
      </SarcoAlert>
      <Heading
        size="lg"
        mb={'30px'}
      >
        Archaeologists
      </Heading>
      <SelectArchaeologists isArchaeologistsDashboard />
    </Flex>
  );
}
