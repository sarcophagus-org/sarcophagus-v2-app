import { useState } from 'react';
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
  Icon,
  NumberInput,
  NumberInputField,
  VStack,
  InputLeftElement,
  InputGroup,
  Input,
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { Loading } from 'components/Loading';
import { formatAddress } from 'lib/utils/helpers';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { TablePageNavigator } from './TablePageNavigator';
import { SortDirection } from 'store/embalm/actions';

export function ArchaeologistList() {
  const {
    onClickNextPage,
    onClickPrevPage,
    handleCheckArchaeologist,
    selectedArchaeologists,
    sortedFilteredArchaeoligist,
    onClickSortDiggingFees,
    diggingFeesSortDirection,
    handleChangeDiggingFeesFilter,
    handleChangeAddressSearch,
    diggingFeesFilter,
    archAddressSearch,
  } = useArchaeologistList();

  const sortIconMap: { [key: string]: JSX.Element } = {
    [SortDirection.NONE]: <Icon> </Icon>, //Blank icon
    [SortDirection.ASC]: <ArrowUpIcon />,
    [SortDirection.DESC]: <ArrowDownIcon />,
  };

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
                    <VStack>
                      <Text
                        variant="secondary"
                        textTransform="capitalize"
                        p="3"
                      >
                        Archaeologists ({sortedFilteredArchaeoligist.length})
                      </Text>
                      <Flex align="center">
                        <Input
                          w="150px"
                          onChange={handleChangeAddressSearch}
                          value={archAddressSearch}
                          placeholder="Search"
                        />
                      </Flex>
                    </VStack>
                  </Th>
                  <Th isNumeric>
                    <VStack>
                      <Button
                        variant="ghost"
                        textTransform="capitalize"
                        rightIcon={sortIconMap[diggingFeesSortDirection]}
                        onClick={onClickSortDiggingFees}
                      >
                        Digging Fee
                      </Button>
                      <Flex align="center">
                        <InputGroup>
                          <NumberInput
                            w="150px"
                            onChange={handleChangeDiggingFeesFilter}
                            value={diggingFeesFilter}
                          >
                            <NumberInputField
                              pl={12}
                              pr={1}
                              placeholder="Max"
                            />
                            <InputLeftElement>
                              <Image src="sarco-token-icon.png" />
                            </InputLeftElement>
                          </NumberInput>
                        </InputGroup>
                      </Flex>
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
