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
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { ethers } from 'ethers';
import { useGetProtocolFeeBasePercentage } from 'hooks/viewStateFacet';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';
import { useState } from 'react';
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
  const protocolFeeBasePercentage = useGetProtocolFeeBasePercentage();

  const [totalDiggingFees, setTotalDiggingFees] = useState(ethers.constants.Zero);

  const { isSarcoInitialized } = useSupportedNetwork();

  if (isSarcoInitialized) {
    sarco.archaeologist
      .getTotalFeesInSarco(
        // @ts-ignore
        selectedArchaeologists,
        resurrection,
        timestampMs
      )
      .then(({ totalDiggingFees: diggingFees, protocolFeeBasePercentage: baseFeePercentage }) => {
        setTotalDiggingFees(diggingFees);
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
              label="This is how much SARCO you will pay in total to your selected Archaeologists to create your Sarcophagus. (NOTE: This sum does not include protocol fees)"
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
                {sarco.utils.formatSarco(totalDiggingFees.add(curseFees).toString())} SARCO
              </Text>
            </Text>
            <Text
              variant="secondary"
              as="i"
              fontSize="12"
            >
              + {protocolFeeBasePercentage / 100}% protocol fee
            </Text>
          </HStack>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
}
