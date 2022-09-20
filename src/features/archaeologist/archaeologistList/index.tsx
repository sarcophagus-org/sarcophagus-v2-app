import {
  Button,
  Checkbox,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Loading } from '../../../components/Loading';
import { useDispatch, useSelector } from '../../../store';
import { formatAddress } from 'lib/utils/helpers';
import { useLoadArchaeologists } from '../hooks/useLoadArchaeologists';
import { SubmitMock } from './SubmitMock';
import { Archaeologist } from 'types';
import { ethers } from 'ethers';
import {
  deselectArchaeologist,
  selectArchaeologist,
  setSelectedArchaeologists,
} from 'store/embalm/actions';

export function ArchaeologistList() {
  const dispatch = useDispatch();

  useLoadArchaeologists();

  const archaeologists = useSelector(s => s.embalmState.archaeologists);
  const selectedArchaeologists = useSelector(s => s.embalmState.selectedArchaeologists);

  function handleCheckArchaeologist(arch: Archaeologist) {
    if (selectedArchaeologists.includes(arch)) {
      dispatch(deselectArchaeologist(arch.profile.archAddress));
    } else {
      dispatch(selectArchaeologist(arch));
    }
  }

  function handleClearSelected() {
    dispatch(setSelectedArchaeologists([]));
  }

  return (
    <Flex
      direction="column"
      height="100%"
    >
      <Button
        width={20}
        size="sm"
        background="gray"
        onClick={handleClearSelected}
      >
        Clear
      </Button>
      <Flex
        flex={4}
        overflowY="hidden"
      >
        <Loading>
          <TableContainer width="100%">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Archaeologists</Th>
                  <Th isNumeric>Digging Fees</Th>
                  <Th isNumeric>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {archaeologists.map(arch => (
                  <Tr key={arch.profile.archAddress}>
                    <Td>
                      <Flex>
                        <Checkbox
                          isChecked={selectedArchaeologists.includes(arch)}
                          onChange={() => {
                            handleCheckArchaeologist(arch);
                          }}
                        />
                        <Text ml={3}>{formatAddress(arch.profile.archAddress)}</Text>
                      </Flex>
                    </Td>
                    <Td isNumeric>
                      <Text>{ethers.utils.formatEther(arch.profile.minimumDiggingFee)} SARCO</Text>
                    </Td>
                    <Td isNumeric>
                      <Text>{arch.isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Loading>
      </Flex>
      <Flex
        flex={1}
        justifyContent="flex-end"
      >
        <SubmitMock />
      </Flex>
    </Flex>
  );
}
