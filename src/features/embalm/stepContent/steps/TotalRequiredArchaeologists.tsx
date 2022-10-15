import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';
import { useEffect, useState } from 'react';
import { setRequiredArchaeologists } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function TotalRequiredArchaegologists() {
  const inputColor = 'violet.400';

  const dispatch = useDispatch();
  const { requiredArchaeologists, selectedArchaeologists } = useSelector(x => x.embalmState);
  const [error, setError] = useState<string | null>(null);
  const totalArchaeologists = selectedArchaeologists.length;

  function handleRequiredArchaeologistsChange(valueAsString: string, valueAsNumber: number) {
    valueAsString = removeNonIntChars(valueAsString);
    valueAsString = removeLeadingZeroes(valueAsString);

    if (valueAsNumber < 0) {
      valueAsString = '0';
      valueAsNumber = 0;
    }

    if (valueAsString.length > 3) return;

    dispatch(setRequiredArchaeologists(valueAsString));
  }

  useEffect(() => {
    if (parseInt(requiredArchaeologists) > totalArchaeologists) {
      setError('You cannot have more required archaeologist than total archaeologists');
    } else {
      setError(null);
    }
  }, [requiredArchaeologists, totalArchaeologists]);

  return (
    <Flex
      w="100%"
      direction="column"
    >
      <Heading>Archaeologists</Heading>
      <Heading
        mt={6}
        size="sm"
      >
        Assign Number of Required Archaeologists
      </Heading>
      <Divider my={6} />
      <Text>
        How many archaeologists are
        required to unwrap the sarcophagus?
      </Text>
      <FormControl>
        <Flex mt={6}>
          <Flex direction="column">
            <NumberInput
              allowMouseWheel
              w="100px"
              color={inputColor}
              value={requiredArchaeologists}
              onChange={handleRequiredArchaeologistsChange}
            >
              <NumberInputField
                borderColor={inputColor}
                color="brand.950"
              />
              <NumberInputStepper>
                <NumberIncrementStepper borderColor={inputColor} />
                <NumberDecrementStepper borderColor={inputColor} />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
        </Flex>
      </FormControl>
      {error && (
        <Text
          mt={3}
          color="error"
        >
          {error}
        </Text>
      )}
      <Divider mt={6} />
    </Flex>
  );
}
