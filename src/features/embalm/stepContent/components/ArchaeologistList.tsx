import {
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Loading } from 'components/Loading';
import { formatAddress } from 'lib/utils/helpers';
import { deselectArchaeologist, selectArchaeologist } from 'store/embalm/actions';
import { useDispatch } from 'store/index';
import { Archaeologist } from 'types/index';
import { useLoadArchaeologists } from '../hooks/useLoadArchaeologists';
import { TablePageNavigator } from './TablePageNavigator';

export function ArchaeologistList() {
  const dispatch = useDispatch();

  const { archaeologists, selectedArchaeologists } = useLoadArchaeologists();

  function handleCheckArchaeologist(archaeologist: Archaeologist) {
    if (selectedArchaeologists.includes(archaeologist)) {
      dispatch(deselectArchaeologist(archaeologist.profile.archAddress));
    } else {
      dispatch(selectArchaeologist(archaeologist));
    }
  }

  // TODO: It doesn't make sense to implement pagination any further until we are loading real archaeologists
  function onClickNextPage() {
    // Temporary console log
    console.log('Will implement pagination when we are loading real archaeologists');
  }

  function onClickPrevPage() {
    // Temporary console log
    console.log('Will implement pagination when we are loading real archaeologists');
  }

  return (
    <Flex
      direction="column"
      height="100%"
      mt={6}
    >
      <Flex
        flex={4}
        height="100%"
        direction="column"
      >
        <Loading>
          <TableContainer
            width="100%"
            overflowY="auto"
            maxHeight="600px"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Text
                      variant="secondary"
                      textTransform="capitalize"
                    >
                      Archaeologists ({archaeologists.length})
                    </Text>
                  </Th>
                  <Th isNumeric>
                    <Text
                      variant="secondary"
                      textTransform="capitalize"
                    >
                      Digging Fee
                    </Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {archaeologists.map(arch => (
                  <Tr
                    key={arch.profile.archAddress}
                    background={selectedArchaeologists.includes(arch) ? 'brand.700' : ''}
                    onClick={() => handleCheckArchaeologist(arch)}
                    cursor="pointer"
                  >
                    <Td>
                      <Text
                        color={selectedArchaeologists.includes(arch) ? 'brand.0' : ''}
                        ml={3}
                      >
                        {formatAddress(arch.profile.archAddress)}
                      </Text>
                    </Td>
                    <Td isNumeric>
                      <Flex justify="center">
                        <Image
                          src="sarco-token-icon.png"
                          w="18px"
                          h="18px"
                        />
                        <Text
                          ml={3}
                          color={selectedArchaeologists.includes(arch) ? 'brand.0' : ''}
                        >
                          {arch.profile.minimumDiggingFee.toString()}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <TablePageNavigator
            onClickNext={onClickNextPage}
            onClickPrevious={onClickPrevPage}
            currentPage={1}
            totalPages={10}
          />
        </Loading>
      </Flex>
    </Flex>
  );
}
