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
import {
  deselectArchaeologist,
  selectArchaeologist,
  setSelectedArchaeologists,
} from '../../../store/archaeologist/actions';
import { formatAddress } from 'lib/utils/helpers';
import { useLoadArchaeologists } from '../hooks/useLoadArchaeologists';
import { ArchaeologistsWarnings } from './ArchaeologistsWarnings';
import { RequiredArchaeologistsPicker } from './RequiredArchaeologistsPicker';
import { SubmitMock } from './SubmitMock';
import { Archaeologist } from 'types';
import { ethers } from 'ethers';

export function ArchaeologistList() {
  const dispatch = useDispatch();

  useLoadArchaeologists();

  const archaeologists = useSelector(s => s.archaeologistState.archaeologists);
  const selectedArchaeologists = useSelector(s => s.archaeologistState.selectedArchaeologists);

  function handleCheckArchaeologist(arch: Archaeologist) {
    if (selectedArchaeologists.includes(arch)) {
      dispatch(deselectArchaeologist(arch));
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
      <RequiredArchaeologistsPicker />
      <ArchaeologistsWarnings />
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
                  <Th isNumeric>Online</Th>
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
                    <Td isNumeric >
                      <Text>{ethers.utils.formatEther(arch.profile.minimumDiggingFee)} SARCO</Text>
                    </Td>
                    <Td>
                      <Flex>
                        <Checkbox
                          isChecked={arch.isOnline}
                          isReadOnly
                        />
                      </Flex>
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
