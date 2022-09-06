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
import { maxTotalArchaeologists } from 'lib/constants';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';
import { useEffect, useState } from 'react';
import { setRequiredArchaeologists, setTotalArchaeologists } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function TotalRequiredArchaegologists() {
  const inputColor = 'violet.400';

  const dispatch = useDispatch();
  const { totalArchaeologists, requiredArchaeologists } = useSelector(x => x.embalmState);
  const [error, setError] = useState<string | null>(null);

  function handleTotalArchaeologistsChange(valueAsString: string, valueAsNumber: number) {
    valueAsString = removeNonIntChars(valueAsString);
    valueAsString = removeLeadingZeroes(valueAsString);

    if (valueAsNumber < 0) {
      valueAsString = '0';
      valueAsNumber = 0;
    }

    if (valueAsString.length > 3) return;

    dispatch(setTotalArchaeologists(valueAsString));
  }

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
    if (parseInt(totalArchaeologists) > maxTotalArchaeologists) {
      setError(`Total number of archaeologists must not exceed ${maxTotalArchaeologists}`);
    } else if (parseInt(requiredArchaeologists) > parseInt(totalArchaeologists)) {
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
        Assign Total Archs and Required Archs
      </Heading>
      <Divider my={6} />
      <Text>
        How many archaeologists would you like to assign to this Sarcophagus and how many are
        required to unwrap?
      </Text>
      <FormControl>
        <Flex mt={6}>
          <Flex
            direction="column"
            w="200px"
          >
            <FormLabel color={inputColor}>Total Archaeologists</FormLabel>
            <NumberInput
              allowMouseWheel
              w="100px"
              color={inputColor}
              value={totalArchaeologists}
              onChange={handleTotalArchaeologistsChange}
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
          <Flex direction="column">
            <FormLabel color={inputColor}>Archaeologists required to unwrap</FormLabel>
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
      <Text
        mt={6}
        variant="secondary"
      >
        Increasing the amount of total archaeologists will increase the chances of one being
        available when you need to unwrap.
      </Text>
      <Divider mt={6} />
    </Flex>
  );
}
