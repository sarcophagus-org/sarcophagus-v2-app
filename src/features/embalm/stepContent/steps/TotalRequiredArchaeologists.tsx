import {
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  HStack,
  VStack,
  chakra,
} from '@chakra-ui/react';
import { setRequiredArchaeologists } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { SarcoAlert } from 'components/SarcoAlert';
import { PageBlockModal } from '../components/PageBlockModal';

export function TotalRequiredArchaegologists() {
  const dispatch = useDispatch();
  const { requiredArchaeologists, selectedArchaeologists } = useSelector(x => x.embalmState);
  const totalArchaeologists = selectedArchaeologists.length;

  function handleRequiredArchaeologistsChange(_: string, valueAsNumber: number) {
    if (isNaN(valueAsNumber)) valueAsNumber = 0;

    dispatch(setRequiredArchaeologists(valueAsNumber));
  }

  return (
    <VStack
      align="left"
      spacing={5}
    >
      <Heading>Archaeologists</Heading>
      <Text
        fontStyle="italic"
        color="text.secondary"
      >
        <chakra.span
          fontStyle="normal"
          color="text.primary"
        >
          How many of your archeologists are required to rewrap or resurrect your sarco?{' '}
        </chakra.span>
        Hint - the greater the minimum, the greater the security.
      </Text>
      <HStack justify="flex-start">
        <NumberInput
          mr={2}
          defaultValue={0}
          min={0}
          max={totalArchaeologists}
          allowMouseWheel
          w="100px"
          value={requiredArchaeologists}
          onChange={handleRequiredArchaeologistsChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Text>of {totalArchaeologists} total arches required.</Text>
      </HStack>
      {totalArchaeologists >= requiredArchaeologists || (
        <SarcoAlert status="error">
          You cannot have more required archaeologist than total archaeologists
        </SarcoAlert>
      )}
      <PageBlockModal />
    </VStack>
  );
}
