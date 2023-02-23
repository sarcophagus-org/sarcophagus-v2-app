import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  Flex,
  HStack,
  Icon,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { calculateProjectedDiggingFees, formatSarco } from 'lib/utils/helpers';
import { useMemo } from 'react';
import { setShowSelectedArchaeologists } from 'store/archaeologistList/actions';
import { useDispatch, useSelector } from 'store/index';

interface ResetPage {
  resetPage: (value: React.SetStateAction<number>) => void;
}

export function ArchaeologistHeader({ resetPage }: ResetPage) {
  const dispatch = useDispatch();
  const { selectedArchaeologists, resurrection } = useSelector(x => x.embalmState);
  const { showSelectedArchaeologists } = useSelector(x => x.archaeologistListState);

  function selectAndReset() {
    dispatch(setShowSelectedArchaeologists(!showSelectedArchaeologists));
    resetPage(1);
  }

  const diggingFees = useMemo(
    () =>
      calculateProjectedDiggingFees(
        selectedArchaeologists.map(a => a.profile.minimumDiggingFeePerSecond),
        resurrection
      ),
    [resurrection, selectedArchaeologists]
  );

  return (
    <Box mt={10}>
      <Flex
        py={'13.5'}
        border={1}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        bgGradient="linear(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
        align={'center'}
        justifyContent={'space-between'}
        borderRadius={'4'}
      >
        <Flex px={3}>
          <HStack direction="row">
            <Checkbox
              variant="brand"
              onChange={() => selectAndReset()}
            />
            <HStack>
              <Text>
                Show
                <Text
                  m={1.5}
                  variant="bold"
                  as="u"
                >
                  {selectedArchaeologists.length === 0 ? '0' : selectedArchaeologists.length}
                </Text>
                selected archaeologists
              </Text>
            </HStack>
          </HStack>
        </Flex>
        {resurrection ? (
          <HStack mr={2}>
            <Tooltip
              label="This is how much SARCO it will cost you each time you rewrap your Sarchophagus"
              placement="top"
            >
              <Icon as={InfoOutlineIcon}></Icon>
            </Tooltip>
            <Text>
              Total Fee:
              <Text
                ml={1.5}
                variant="bold"
                as="u"
              >
                {formatSarco(diggingFees)} SARCO
              </Text>
            </Text>
            <Text
              variant="secondary"
              as="i"
              fontSize="10"
            >
              +1% protocol fee
            </Text>
          </HStack>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
}
