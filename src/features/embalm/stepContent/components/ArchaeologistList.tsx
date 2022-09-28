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
  Button,
  VStack,
  Input,
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons';
import { Loading } from 'components/Loading';
import { formatAddress } from 'lib/utils/helpers';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { TablePageNavigator } from './TablePageNavigator';
import { SortDirection, setDiggingFeesFilter } from 'store/embalm/actions';
import { useDispatch } from 'store/index';
import { DiggingFeesInput } from '../components/DiggingFeesInput';
import { ethers } from 'ethers';

export function ArchaeologistList() {
  const {
    onClickNextPage,
    onClickPrevPage,
    handleCheckArchaeologist,
    selectedArchaeologists,
    sortedFilteredArchaeoligist,
    onClickSortDiggingFees,
    diggingFeesSortDirection,
    handleChangeAddressSearch,
    diggingFeesFilter,
    archAddressSearch,
  } = useArchaeologistList();
  const dispatch = useDispatch();

  const sortIconsMap: { [key: number]: JSX.Element } = {
    [SortDirection.NONE]: <ArrowUpDownIcon> </ArrowUpDownIcon>,
    [SortDirection.ASC]: <ArrowUpIcon />,
    [SortDirection.DESC]: <ArrowDownIcon />,
  };

  function setDiggingFees(diggingFees: string) {
    return dispatch(setDiggingFeesFilter(diggingFees));
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
            maxHeight="650px"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <VStack align="left">
                      <Text
                        variant="secondary"
                        textTransform="capitalize"
                        py={3}
                      >
                        Archaeologists ({sortedFilteredArchaeoligist.length})
                      </Text>
                      <Input
                        w="200px"
                        onChange={handleChangeAddressSearch}
                        value={archAddressSearch}
                        placeholder="Search"
                        borderColor="violet.700"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  <Th isNumeric>
                    <VStack>
                      <Button
                        variant="ghost"
                        textTransform="capitalize"
                        rightIcon={sortIconsMap[diggingFeesSortDirection]}
                        onClick={onClickSortDiggingFees}
                      >
                        Digging Fee
                      </Button>
                      <DiggingFeesInput
                        setDiggingFees={setDiggingFees}
                        value={diggingFeesFilter}
                        placeholder="Max"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedFilteredArchaeoligist.map(arch => (
                  <Tr
                    key={arch.profile.archAddress}
                    background={selectedArchaeologists.includes(arch) ? 'brand.700' : ''}
                    onClick={() => handleCheckArchaeologist(arch)}
                    cursor="pointer"
                    _hover={
                      selectedArchaeologists.includes(arch)
                        ? {}
                        : {
                            background: 'brand.100',
                          }
                    }
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
                          {ethers.utils.formatEther(arch.profile.minimumDiggingFee)}
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
