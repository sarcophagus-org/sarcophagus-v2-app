import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { formatLargeNumber, formatResurrection } from 'lib/utils/helpers';
import { setDiggingFees } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function SetDiggingFees() {
  const dispatch = useDispatch();
  const { diggingFees, resurrection } = useSelector(x => x.embalmState);

  function handleChangeDiggingFees(valueAsString: string, valueAsNumber: number) {
    // Must not be negative
    if (valueAsNumber < 0) return;

    // Must not be too big
    if (valueAsString.length > 18) return;

    // Must not be an empty string
    if (valueAsString.trim() === '') valueAsString = '0';

    // No decimals or dashes
    const parsedValue = parseInt(valueAsString.replace(/[-\.]/g, ''));

    dispatch(setDiggingFees(parsedValue.toString()));
  }

  return (
    <Flex direction="column">
      <Heading>Set Digging Fees</Heading>
      <Heading
        size="sm"
        mt={9}
      >
        How much are you willing to pay each time you rewrap?
      </Heading>
      <FormControl mt={9}>
        <FormLabel color="brand.500">Rewrap digging fees *</FormLabel>
        <Flex align="center">
          <NumberInput
            w="150px"
            onChange={handleChangeDiggingFees}
            value={diggingFees}
          >
            <NumberInputField
              pl={12}
              pr={1}
              borderColor="violet.700"
            />
          </NumberInput>
          <Image
            src="sarco-token-icon.png"
            position="absolute"
            top="39px"
            left="16px"
          />
        </Flex>
      </FormControl>
      <Flex
        mt={3}
        align="center"
        overflow="hidden"
        flex={1}
      >
        <Text>Max digging fee</Text>
        <Flex mx="0.5rem">
          <Image
            w="18px"
            h="18px"
            src="sarco-token-icon.png"
          />
          <Text
            flex={1}
            ml="0.5rem"
          >
            {diggingFees.trim() !== '' ? formatLargeNumber(diggingFees) : '0'}
          </Text>
        </Flex>
        <Text>due on each rewrap.</Text>
      </Flex>
      <Text mt={3}>First rewrap is {formatResurrection(resurrection)} from now.</Text>
    </Flex>
  );
}
