import { Box, Text } from '@chakra-ui/react';
import { useSelector } from '../../../store';

export function ArchaeologistsWarnings() {
  const archaeologistsRequired = useSelector(s => s.archaeologistState.archaeologistsRequired);
  const selectedArchaeologists = useSelector(s => s.archaeologistState.selectedArchaeologists);

  let warningText = '';

  if (selectedArchaeologists.length < archaeologistsRequired) {
    warningText =
      'You must have more archaeologists selected than the required number of archaeologists.';
  }

  return (
    <Box
      mt={6}
      height={6}
    >
      <Text
        fontSize="small"
        color="goldenrod"
      >
        {warningText}
      </Text>
    </Box>
  );
}
