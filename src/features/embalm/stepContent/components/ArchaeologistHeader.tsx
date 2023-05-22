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
import { ethers } from 'ethers';
import { useState } from 'react';
import { formatSarco, sarco } from 'sarcophagus-v2-sdk';
import { setShowSelectedArchaeologists } from 'store/archaeologistList/actions';
import { useDispatch, useSelector } from 'store/index';

interface ResetPage {
  resetPage: (value: React.SetStateAction<number>) => void;
}

export function ArchaeologistHeader({ resetPage }: ResetPage) {
  const dispatch = useDispatch();
  const { selectedArchaeologists, resurrection } = useSelector(x => x.embalmState);
  const { showOnlySelectedArchaeologists } = useSelector(x => x.archaeologistListState);
  const { timestampMs } = useSelector(x => x.appState);

  const [totalDiggingFees, setTotalDiggingFees] = useState(ethers.constants.Zero);
  const [protocolFeeBasePercentage, setProtocolFeeBasePercentage] = useState('--');

  if (sarco.isInitialised) {
    sarco.archaeologist
      .getTotalFeesInSarco(
        // @ts-ignore
        selectedArchaeologists,
        resurrection,
        timestampMs
      )
      .then(({ totalDiggingFees: diggingFees, protocolFeeBasePercentage: baseFeePercentage }) => {
        setTotalDiggingFees(diggingFees);
        setProtocolFeeBasePercentage(baseFeePercentage.toString());
      })
      .catch(e => console.log(e));
  }

  function toggleShowOnlySelected() {
    dispatch(setShowSelectedArchaeologists(!showOnlySelectedArchaeologists));
    resetPage(1);
  }

  const curseFees = selectedArchaeologists.reduce((acc, archaeologist) => {
    return acc.add(archaeologist.profile.curseFee);
  }, ethers.constants.Zero);

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
              onChange={() => toggleShowOnlySelected()}
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
              label="This is how much SARCO it will cost you the next time you rewrap the Sarcophagus"
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
                {formatSarco(totalDiggingFees.add(curseFees).toString())} SARCO
              </Text>
            </Text>
            <Text
              variant="secondary"
              as="i"
              fontSize="10"
            >
              +{protocolFeeBasePercentage}% protocol fee
            </Text>
          </HStack>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
}
