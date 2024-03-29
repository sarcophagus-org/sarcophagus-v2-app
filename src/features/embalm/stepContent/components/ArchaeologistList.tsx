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
import { QuestionIcon } from '@chakra-ui/icons';
import { DownIcon, UpDownIcon, UpIcon } from 'components/icons';
import { Loading } from 'components/Loading';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { deselectArchaeologist, SortDirection } from 'store/embalm/actions';
import { SortFilterType } from 'store/archaeologistList/actions';
import { FilterInput } from './FilterInput';
import { useState } from 'react';
import { useDispatch, useSelector } from 'store/index';
import { ArchaeologistListItem } from './ArchaeologistListItem';
import { ArchaeologistData } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function ArchaeologistList({
  showDial,
  paginatedArchaeologists,
  totalCount,
}: {
  totalCount: number;
  showDial?: boolean;
  paginatedArchaeologists: ArchaeologistData[];
}) {
  const {
    handleCheckArchaeologist,
    selectedArchaeologists,
    hiddenArchaeologists,
    onClickSortDiggingFees,
    onClickSortCurseFee,
    onClickSortUnwraps,
    onClickSortFails,
    onClickSortArchs,
    archaeologistFilterSort,
    diggingFeesFilter,
    curseFeeFilter,
    archAddressSearch,
    unwrapsFilter,
    failsFilter,
  } = useArchaeologistList();

  const resurrectionTime = useSelector(s => s.embalmState.resurrection);

  const sortIconsMap: { [key: number]: JSX.Element } = {
    [SortDirection.NONE]: <UpDownIcon />,
    [SortDirection.ASC]: <UpIcon />,
    [SortDirection.DESC]: <DownIcon />,
  };

  // Used for testing archaeologist connection
  // TODO -- can be removed once we resolve connection issues
  const [isDialing, setIsDialing] = useState(false);

  function filterIcon(sortType: SortFilterType): JSX.Element {
    return archaeologistFilterSort.sortType === sortType
      ? sortIconsMap[archaeologistFilterSort.sortDirection]
      : sortIconsMap[SortDirection.NONE];
  }

  const dispatch = useDispatch();

  hiddenArchaeologists.map(a => {
    if (selectedArchaeologists.includes(a)) {
      dispatch(deselectArchaeologist(a.profile.archAddress));
    }
  });

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
                  <Th borderBottom="none">
                    <VStack align="left">
                      <Button
                        variant="ghost"
                        rightIcon={filterIcon(SortFilterType.ADDRESS_SEARCH)}
                        onClick={onClickSortArchs}
                        color="text.primary"
                        p={'0.5'}
                      >
                        Archaeologists ({totalCount})
                      </Button>
                      <FilterInput
                        filterName={SortFilterType.ADDRESS_SEARCH}
                        value={archAddressSearch}
                      />
                    </VStack>
                  </Th>
                  <Th
                    isNumeric
                    borderBottom="none"
                  >
                    <VStack align="left">
                      <HStack>
                        <Button
                          variant="ghost"
                          rightIcon={filterIcon(SortFilterType.DIGGING_FEES)}
                          onClick={onClickSortDiggingFees}
                          p={'0.5'}
                        >
                          <Text> Digging Fee </Text>
                        </Button>
                        {resurrectionTime === 0 ? null : (
                          <Tooltip
                            label="Amount to be paid to the archaeologist in order for it to resurrect at the resurrrection time you have selected."
                            placement="top"
                          >
                            <Icon
                              as={QuestionIcon}
                              color="brand.950"
                            />
                          </Tooltip>
                        )}
                      </HStack>
                      <FilterInput
                        filterName={SortFilterType.DIGGING_FEES}
                        value={diggingFeesFilter}
                        placeholder="max"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  <Th
                    isNumeric
                    borderBottom="none"
                  >
                    <VStack align="left">
                      <HStack>
                        <Button
                          variant="ghost"
                          rightIcon={filterIcon(SortFilterType.CURSE_FEE)}
                          onClick={onClickSortCurseFee}
                          p={'0.5'}
                        >
                          <Flex
                            direction="column"
                            alignItems="flex-start"
                          >
                            <Text> Curse Fee </Text>
                            <Text
                              fontSize="xs"
                              mt={1}
                              variant="secondary"
                            >
                              <i>One-time</i>
                            </Text>
                          </Flex>
                        </Button>
                        <Tooltip
                          label="A one time fee to be paid to the Archaeologist in order to be cursed on your Sarcophagus."
                          placement="top"
                        >
                          <Icon
                            as={QuestionIcon}
                            color="brand.950"
                          />
                        </Tooltip>
                      </HStack>
                      <FilterInput
                        filterName={SortFilterType.CURSE_FEE}
                        value={curseFeeFilter}
                        placeholder="max"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  <Th
                    isNumeric
                    borderBottom="none"
                  >
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
                  <Th
                    isNumeric
                    borderBottom="none"
                  >
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
                {paginatedArchaeologists?.map(arch => {
                  const isSelected =
                    selectedArchaeologists.findIndex(
                      a => a.profile.peerId === arch.profile.peerId
                    ) !== -1;

                  return (
                    <ArchaeologistListItem
                      key={arch.profile.archAddress}
                      archaeologist={arch}
                      onClick={() => {
                        if (showDial || arch.ineligibleReason) return;
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
