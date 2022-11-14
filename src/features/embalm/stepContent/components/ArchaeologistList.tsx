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
  Checkbox,
  HStack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import { Archaeologist } from '../../../../types/index';
import { QuestionIcon } from '@chakra-ui/icons';
import { DownIcon } from 'components/icons/DownIcon';
import { UpDownIcon } from 'components/icons/UpDownIcon';
import { UpIcon } from 'components/icons/UpIcon';
import { Loading } from 'components/Loading';
import { formatAddress } from 'lib/utils/helpers';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { SortDirection, selectArchaeologist, deselectArchaeologist } from 'store/embalm/actions';
import { FilterInput } from './FilterInput';
import { ethers } from 'ethers';
import { useState, Dispatch, SetStateAction, ReactChild } from 'react';
import { useDialArchaeologists } from '../../../../hooks/utils/useDialArchaeologists';
import { useBootLibp2pNode } from '../../../../hooks/libp2p/useBootLibp2pNode';
import { useDispatch } from 'store/index';

interface ArchaeologistListItemProps {
  archaeologist: Archaeologist;
  isSelected: boolean;
  includeDialButton: boolean;
  isDialing: boolean;
  setIsDialing: Dispatch<SetStateAction<boolean>>;
  onClick: () => void;
}

interface TableContentProps {
  children: React.ReactNode;
  icon: boolean;
  checkbox: boolean;
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
  const { testDialArchaeologist } = useDialArchaeologists(setIsDialing);
  const dispatch = useDispatch();

  function TableContent({ children, icon, checkbox }: TableContentProps) {
    return (
      <Td isNumeric>
        <Flex justify={icon || checkbox ? 'left' : 'center'}>
          {icon && (
            <Image
              src="sarco-token-icon.png"
              w="18px"
              h="18px"
            />
          )}
          {checkbox && (
            <Checkbox
              isChecked={isSelected && true}
              onChange={() => {
                if (isSelected === true) {
                  dispatch(selectArchaeologist(archaeologist));
                } else {
                  dispatch(deselectArchaeologist(archaeologist.profile.archAddress));
                }
              }}
              colorScheme="blue"
            ></Checkbox>
          )}
          <Text
            ml={3}
            bg={'brand.100'}
            py={0.5}
            px={2}
          >
            {children}
          </Text>
        </Flex>
      </Td>
    );
  }

  return (
    <Tr
      background={isSelected ? 'brand.50' : ''}
      onClick={() => {
        onClick();
        if (!isSelected) {
          setIsPinging(true);
        }
      }}
      cursor="pointer"
      _hover={isSelected ? {} : { background: 'brand.0' }}
    >
      <TableContent
        icon={false}
        checkbox={true}
      >
        {formatAddress(archaeologist.profile.archAddress)}
      </TableContent>
      <TableContent
        icon={true}
        checkbox={false}
      >
        {Number(ethers.utils.formatEther(archaeologist.profile.minimumDiggingFee))
          .toFixed(0)
          .toString()
          .concat(' SARCO')}
      </TableContent>
      <TableContent
        icon={false}
        checkbox={false}
      >
        {archaeologist.profile.successes.toString()}
      </TableContent>
      <TableContent
        icon={false}
        checkbox={false}
      >
        {' '}
        {archaeologist.profile.cleanups.toString()}
      </TableContent>

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
    </Tr>
  );
}

export function ArchaeologistList({
  includeDialButton,
  paginatedArchaeologist,
}: {
  includeDialButton?: boolean;
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
    diggingFeesSortDirection,
    unwrapsSortDirection,
    failsSortDirection,
    archsSortDirection,
    handleChangeAddressSearch,
    diggingFeesFilter,
    unwrapsFilter,
    failsFilter,
    archAddressSearch,
  } = useArchaeologistList();

  const sortIconsMap: { [key: number]: JSX.Element } = {
    [SortDirection.NONE]: <UpDownIcon />,
    [SortDirection.ASC]: <UpIcon />,
    [SortDirection.DESC]: <DownIcon />,
  };

  // Used for testing archaeologist connection
  // TODO -- can be removed once we resolve connection issues
  const [isDialing, setIsDialing] = useState(false);
  const { testDialArchaeologist } = useDialArchaeologists(setIsDialing);
  useBootLibp2pNode();

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
                        rightIcon={sortIconsMap[archsSortDirection]}
                        onClick={onClickSortArchs}
                        color="brand.950"
                        p={'0'}
                      >
                        Archaeologists ({sortedFilteredArchaeologist?.length})
                      </Button>
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
                    <VStack align="left">
                      <HStack>
                        <Button
                          variant="ghost"
                          rightIcon={sortIconsMap[diggingFeesSortDirection]}
                          onClick={onClickSortDiggingFees}
                          p={'0'}
                        >
                          <Text> Fees </Text>
                        </Button>
                        <Popover trigger={'hover'}>
                          <PopoverTrigger>
                            <Icon
                              as={QuestionIcon}
                              color="brand.950"
                            ></Icon>
                          </PopoverTrigger>
                          <PopoverContent
                            background="black"
                            color="brand.950"
                          >
                            <PopoverBody textAlign={'left'}>Lorem ipsum dolor sit amet</PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </HStack>
                      <FilterInput
                        filterName={'DiggingFees'}
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
                        rightIcon={sortIconsMap[unwrapsSortDirection]}
                        onClick={onClickSortUnwraps}
                        p={'0'}
                      >
                        <Text align="left"> Unwraps </Text>
                      </Button>
                      <FilterInput
                        filterName={'Unwraps'}
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
                        rightIcon={sortIconsMap[failsSortDirection]}
                        onClick={onClickSortFails}
                        p={'0'}
                      >
                        <Text> Fails </Text>
                      </Button>
                      <FilterInput
                        filterName={'Fails'}
                        value={failsFilter}
                        placeholder="max"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  {includeDialButton ? <Th>Dial</Th> : <></>}
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
                        if (includeDialButton) return;
                        handleCheckArchaeologist(arch);
                      }}
                      includeDialButton={!!includeDialButton}
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
