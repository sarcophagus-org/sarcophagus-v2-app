import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from '../../../store';
import { setArchaeologistsRequired } from '../../../store/archaeologist/actions';

export function RequiredArchaeologistsPicker() {
  const dispatch = useDispatch();

  const archaeologistsRequired = useSelector(s => s.archaeologistState.archaeologistsRequired);

  function handleChangeArchaeologistsRequired(value: string) {
    dispatch(setArchaeologistsRequired(parseInt(value)));
  }

  return (
    <Flex
      mt={6}
      alignItems="center"
    >
      <Text>How many archaeologists do you require to unwrap?</Text>
      <NumberInput
        width={100}
        min={0}
        ml={6}
        onChange={handleChangeArchaeologistsRequired}
        value={archaeologistsRequired}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
}
