import { Flex, FormControl, FormLabel, Heading, Image, Text } from '@chakra-ui/react';
import { formatLargeNumber, humanizeDuration } from 'lib/utils/helpers';
import { setDiggingFees } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { DiggingFeesInput } from '../components/DiggingFeesInput';

export function SetDiggingFees() {
  const dispatch = useDispatch();
  const { diggingFees, resurrection } = useSelector(x => x.embalmState);

  function setFees(diggingFees1: string) {
    return dispatch(setDiggingFees(diggingFees1));
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

        <DiggingFeesInput
          setDiggingFees={setFees}
          value={diggingFees}
        />
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
      <Text mt={3}>First rewrap is {humanizeDuration(resurrection)} from now.</Text>
    </Flex>
  );
}
