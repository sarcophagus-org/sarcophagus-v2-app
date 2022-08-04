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
import { formatAddress } from '../../../utils/helpers';
import { useLoadMockArchaeologists } from '../hooks/useLoadMockArchaeologists.ts';
import { ArchaeologistsWarnings } from './ArchaeologistsWarnings';
import { GenerateArchaeologists } from './GenerateArchaeologists';
import { RequiredArchaeologistsPicker } from './RequiredArchaeologistsPicker';
import { SubmitMock } from './SubmitMock';

export function ArchaeologistList() {
  const dispatch = useDispatch();

  // TODO: Replace this with real version to load real archaeologists
  useLoadMockArchaeologists();

  const archaeologists = useSelector(s => s.archaeologistState.archaeologists);
  const selectedArchaeologists = useSelector(s => s.archaeologistState.selectedArchaeologists);

  function handleCheckArchaeologist(address: string) {
    if (selectedArchaeologists.includes(address)) {
      dispatch(deselectArchaeologist(address));
    } else {
      dispatch(selectArchaeologist(address));
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
      <GenerateArchaeologists />
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
                  <Th>Arweave</Th>
                  <Th isNumeric>Digging Fees</Th>
                  <Th isNumeric>Bounty</Th>
                </Tr>
              </Thead>
              <Tbody>
                {archaeologists.map(arch => (
                  <Tr key={arch.address}>
                    <Td>
                      <Flex>
                        <Checkbox
                          isChecked={selectedArchaeologists.includes(arch.address)}
                          onChange={() => {
                            handleCheckArchaeologist(arch.address);
                          }}
                        />
                        <Text ml={3}>{formatAddress(arch.address)}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Text>{arch.isArweaver.toString()}</Text>
                    </Td>
                    <Td isNumeric>
                      <Text>{arch.diggingFee.toString()} SARCO</Text>
                    </Td>
                    <Td isNumeric>
                      <Text>{arch.bounty.toString()} SARCO</Text>
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
