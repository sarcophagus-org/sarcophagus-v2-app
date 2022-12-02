import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  VStack,
  HStack,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { Archaeologist } from '../../../../types/index';
import { QuestionIcon } from '@chakra-ui/icons';
import { DownIcon, UpDownIcon, UpIcon } from 'components/icons';
import { Loading } from 'components/Loading';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { SortDirection } from 'store/embalm/actions';
import { SortFilterType } from 'store/archaeologistList/actions';
import { FilterInput } from './FilterInput';
import { useState } from 'react';
import { useBootLibp2pNode } from '../../../../hooks/libp2p/useBootLibp2pNode';
import { ArchaeologistListItem } from './ArchaeologistListItem';
import { useDialArchaeologists } from '../hooks/useCreateSarcophagus/useDialArchaeologists';

export function ArchaeologistList({
  showDial,
  paginatedArchaeologist,
}: {
  showDial?: boolean;
  paginatedArchaeologist: Archaeologist[];
}) {
  const {
    handleCheckArchaeologist,
    selectedArchaeologists,
    sortedFilteredArchaeologist,
    onClickSortDiggingFees,
    onClickSortUnwraps,
    onClickSortFails,
    onClickSortArchs,
    archaeologistFilterSort,
    diggingFeesFilter,
    archAddressSearch,
    unwrapsFilter,
    failsFilter,
    showSelectedArchaeologists,
  } = useArchaeologistList();

  const sortIconsMap: { [key: number]: JSX.Element } = {
    [SortDirection.NONE]: <UpDownIcon />,
    [SortDirection.ASC]: <UpIcon />,
    [SortDirection.DESC]: <DownIcon />,
  };

  // Used for testing archaeologist connection
  // TODO -- can be removed once we resolve connection issues
  const [isDialing, setIsDialing] = useState(false);
  useBootLibp2pNode();

  function filterIcon(sortType: SortFilterType): JSX.Element {
    return archaeologistFilterSort.sortType === sortType
      ? sortIconsMap[archaeologistFilterSort.sortDirection]
      : sortIconsMap[SortDirection.NONE];
  }

  return (
    <Flex
      direction="column"
      height="100%"
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
            maxHeight="auto"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <VStack align="left">
                      <Button
                        variant="ghost"
                        rightIcon={filterIcon(SortFilterType.ADDRESS_SEARCH)}
                        onClick={onClickSortArchs}
                        color="text.primary"
                        p={'0.5'}
                      >
                        Archaeologists (
                        {sortedFilteredArchaeologist(showSelectedArchaeologists)?.length})
                      </Button>
                      <FilterInput
                        filterName={SortFilterType.ADDRESS_SEARCH}
                        value={archAddressSearch}
                      />
                    </VStack>
                  </Th>
                  <Th isNumeric>
                    <VStack align="left">
                      <HStack>
                        <Button
                          variant="ghost"
                          rightIcon={filterIcon(SortFilterType.DIGGING_FEES)}
                          onClick={onClickSortDiggingFees}
                          p={'0.5'}
                        >
                          <Text> Fees </Text>
                        </Button>
                        <Tooltip
                          label="Amount to be paid for each rewrap"
                          placement="top"
                        >
                          <Icon
                            as={QuestionIcon}
                            color="brand.950"
                          />
                        </Tooltip>
                      </HStack>
                      <FilterInput
                        filterName={SortFilterType.DIGGING_FEES}
                        value={diggingFeesFilter}
                        placeholder="max"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  <Th isNumeric>
                    <VStack align="left">
                      <Button
                        variant="ghost"
                        rightIcon={filterIcon(SortFilterType.UNWRAPS)}
                        onClick={onClickSortUnwraps}
                        p={'0'}
                      >
                        <Text align="left"> Unwraps </Text>
                      </Button>
                      <FilterInput
                        filterName={SortFilterType.UNWRAPS}
                        value={unwrapsFilter}
                        placeholder="min"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  <Th isNumeric>
                    <VStack align="left">
                      <Button
                        variant="ghost"
                        rightIcon={filterIcon(SortFilterType.FAILS)}
                        onClick={onClickSortFails}
                        p={'0'}
                      >
                        <Text> Fails </Text>
                      </Button>
                      <FilterInput
                        filterName={SortFilterType.FAILS}
                        value={failsFilter}
                        placeholder="max"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  {showDial ? <Th>Dial</Th> : <></>}
                </Tr>
              </Thead>
              <Tbody>
                {paginatedArchaeologist?.map(arch => {
                  const isSelected =
                    selectedArchaeologists.findIndex(
                      a => a.profile.peerId === arch.profile.peerId
                    ) !== -1;

                  return (
                    <ArchaeologistListItem
                      key={arch.profile.archAddress}
                      archaeologist={arch}
                      onClick={() => {
                        if (showDial) return;
                        handleCheckArchaeologist(arch);
                      }}
                      includeDialButton={showDial!}
                      isDialing={isDialing}
                      setIsDialing={setIsDialing}
                      isSelected={isSelected}
                    />
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Loading>
      </Flex>
    </Flex>
  );
}
