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
  Spinner,
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons';
import { Loading } from 'components/Loading';
import { formatAddress } from 'lib/utils/helpers';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { TablePageNavigator } from './TablePageNavigator';
import { SortDirection, setDiggingFeesFilter } from 'store/embalm/actions';
import { useDispatch } from 'store/index';
import { DiggingFeesInput } from './DiggingFeesInput';
import { ethers } from 'ethers';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTestDialArchaeologists } from '../../../../hooks/utils/useTestDialArchaeologists';
import { useBootLibp2pNode } from '../../../../hooks/libp2p/useBootLibp2pNode';
import { Archaeologist } from 'types';
import { useDialArchaeologists } from '../hooks/useCreateSarcophagus/useDialArchaeologists';

interface ArchaeologistListItemProps {
  archaeologist: Archaeologist;
  isSelected: boolean;
  includeDialButton: boolean;
  isDialing: boolean;
  setIsDialing: Dispatch<SetStateAction<boolean>>;
  onClick: () => void;
}

function ArchaeologistListItem({
  isSelected,
  archaeologist,
  includeDialButton,
  isDialing,
  setIsDialing,
  onClick,

}: ArchaeologistListItemProps) {
  const [isPinging, setIsPinging] = useState(false);
  const { testDialArchaeologist } = useTestDialArchaeologists(setIsDialing);
  const { pingArchaeologist } = useDialArchaeologists();

  const rowTextColor = isSelected ? (archaeologist.exception ? '' : 'brand.0') : '';

  return (<Tr
    background={isSelected ? (archaeologist.exception ? 'errorHighlight' : 'brand.700') : ''}
    onClick={() => {
      onClick();

      if (!isSelected) {
        setIsPinging(true);
        pingArchaeologist(archaeologist.fullPeerId!, () => setIsPinging(false));
      }
    }}
    cursor="pointer"
    _hover={isSelected ? {} : { background: 'brand.100' }}
  >
    <Td>
      <Flex>
        {isPinging ? <Spinner size="sm" /> : <></>}
        <Text
          color={rowTextColor}
          ml={3}
        >
          {formatAddress(archaeologist.profile.archAddress)}
        </Text>
      </Flex>
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
          color={rowTextColor}
        >
          {ethers.utils.formatEther(archaeologist.profile.minimumDiggingFee)}
        </Text>
      </Flex>
    </Td>
    {includeDialButton ? (
      <Td>
        <Button
          disabled={isDialing || !!archaeologist.connection}
          onClick={() => testDialArchaeologist(archaeologist.fullPeerId!)}
        >
          {archaeologist.connection ? 'Connected' : 'Dial'}
        </Button>
      </Td>
    ) : (
      <></>
    )}
  </Tr>);
}

export function ArchaeologistList({ includeDialButton }: { includeDialButton?: boolean }) {
  const {
    onClickNextPage,
    onClickPrevPage,
    handleCheckArchaeologist,
    selectedArchaeologists,
    sortedFilteredArchaeologist,
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

  // Used for testing archaeologist connection
  // TODO -- can be removed once we resolve connection issues
  const [isDialing, setIsDialing] = useState(false);
  useBootLibp2pNode();

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
                        Archaeologists ({sortedFilteredArchaeologist.length})
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
                  {includeDialButton ? <Th>Dial</Th> : <></>}
                </Tr>
              </Thead>
              <Tbody>
                {sortedFilteredArchaeologist.map(arch => {
                  const isSelected =
                    selectedArchaeologists.findIndex(
                      a => a.profile.peerId === arch.profile.peerId
                    ) !== -1;

                  return <ArchaeologistListItem
                    key={arch.profile.archAddress}
                    archaeologist={arch}
                    onClick={() => {
                      if (includeDialButton) return;
                      handleCheckArchaeologist(arch);
                    }}
                    includeDialButton={!!includeDialButton}
                    isDialing={isDialing}
                    setIsDialing={setIsDialing}
                    isSelected={isSelected}
                  />;
                })}
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
