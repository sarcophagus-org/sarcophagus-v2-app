import {
  Button,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from '../../../store';
import { startLoad, stopLoad } from '../../../store/app/actions';
import {
  setSelectedArchaeologists,
  storeArchaeologists,
} from '../../../store/archaeologist/actions';
import { generateMockArchaeologists } from 'lib/utils/generateMockArchaeologists';

/**
 * Only used for generating mock archaeologists
 */
export function GenerateArchaeologists({ defaultCount = 10 }: { defaultCount?: number }) {
  const dispatch = useDispatch();

  const [count, setCount] = useState(defaultCount);

  // Manually generate archaeologists. Only for mock list
  async function handleGenerateArchaeologists() {
    try {
      dispatch(startLoad());
      const mockArchaeologists = await generateMockArchaeologists(count);
      dispatch(storeArchaeologists(mockArchaeologists));
      dispatch(setSelectedArchaeologists([]));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(stopLoad());
    }
  }

  function handleChangeCount(value: string) {
    setCount(parseInt(value));
  }

  return (
    <Flex mt={6}>
      <NumberInput
        width={100}
        min={0}
        onChange={handleChangeCount}
        value={count}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Button
        ml={6}
        background="grey"
        onClick={handleGenerateArchaeologists}
      >
        Generate Mock Archaeologists
      </Button>
      <Text
        ml={4}
        color="gray"
        fontSize="small"
        width={300}
      >
        Generates random wallets using ethers. Large numbers can take some time.
      </Text>
    </Flex>
  );
}
