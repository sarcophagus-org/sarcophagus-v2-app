import { Box, Heading } from '@chakra-ui/react';
import { ArchaeologistList } from '../features/archaeologist/archaeologistList';

export function ArchaeologistsPage() {
  return (
    <Box height="100%">
      <Heading size="lg">Archaeologists</Heading>
      <ArchaeologistList />
    </Box>
  );
}
