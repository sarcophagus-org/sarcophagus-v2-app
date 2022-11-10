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
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, QuestionIcon } from '@chakra-ui/icons';
import { Loading } from 'components/Loading';
import { formatAddress } from 'lib/utils/helpers';
import { useArchaeologistList } from '../hooks/useArchaeologistList';

import {
  SortDirection,
  setDiggingFeesFilter,
  setUnwrapsFilter,
  setFailsFilter,
} from 'store/embalm/actions';
import { useDispatch } from 'store/index';
import { DiggingFeesInput } from './DiggingFeesInput';
import { UnwrapsInput } from './UnwrapsInput';
import { FailsInput } from './FailsInput';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useDialArchaeologists } from '../../../../hooks/utils/useDialArchaeologists';
import { useBootLibp2pNode } from '../../../../hooks/libp2p/useBootLibp2pNode';

export function ArchaeologistList({
  includeDialButton,
  currentPageData,
}: {
  includeDialButton?: boolean;
  currentPageData: Archaeologist[];
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
  const dispatch = useDispatch();

  const sortIconsMap: { [key: number]: JSX.Element } = {
    [SortDirection.NONE]: <ArrowUpDownIcon> </ArrowUpDownIcon>,
    [SortDirection.ASC]: <ArrowUpIcon />,
    [SortDirection.DESC]: <ArrowDownIcon />,
  };

  // function setSelectedArches

  function setDiggingFees(diggingFees: string) {
    return dispatch(setDiggingFeesFilter(diggingFees));
  }

  function setUnwraps(unwraps: string) {
    return dispatch(setUnwrapsFilter(unwraps));
  }

  function setFails(fails: string) {
    return dispatch(setFailsFilter(fails));
  }

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
                    <VStack>
                      <div>
                        <Button
                          variant="ghost"
                          rightIcon={sortIconsMap[diggingFeesSortDirection]}
                          onClick={onClickSortDiggingFees}
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
                      </div>
                      <DiggingFeesInput
                        setDiggingFees={setDiggingFees}
                        value={diggingFeesFilter}
                        placeholder="max"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  <Th isNumeric>
                    <VStack>
                      <Button
                        variant="ghost"
                        rightIcon={sortIconsMap[unwrapsSortDirection]}
                        onClick={onClickSortUnwraps}
                      >
                        <Text> Unwraps </Text>
                      </Button>
                      <UnwrapsInput
                        setUnwraps={setUnwraps}
                        value={unwrapsFilter}
                        placeholder="min"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  <Th isNumeric>
                    <VStack>
                      <Button
                        variant="ghost"
                        rightIcon={sortIconsMap[failsSortDirection]}
                        onClick={onClickSortFails}
                      >
                        <Text> Fails </Text>
                      </Button>
                      <FailsInput
                        setFails={setFails}
                        value={failsFilter}
                        placeholder="min"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  {includeDialButton ? <Th>Dial</Th> : <></>}
                </Tr>
              </Thead>
              <Tbody>
                {currentPageData?.map(arch => {
                  const isSelected =
                    selectedArchaeologists.findIndex(
                      a => a.profile.peerId === arch.profile.peerId
                    ) !== -1;

                  return (
                    <Tr
                      key={arch.profile.archAddress}
                      background={isSelected ? 'brand.50' : ''}
                      color={'brand.950'}
                      onClick={() => (includeDialButton ? {} : handleCheckArchaeologist(arch))}
                      cursor="pointer"
                      _hover={
                        isSelected
                          ? {}
                          : {
                              background: 'brand.0',
                            }
                      }
                    >
                      <Td>
                        <HStack>
                          <Checkbox
                            isChecked={isSelected && true}
                            colorScheme="blue"
                          ></Checkbox>
                          <Text
                            ml={3}
                            bg={'brand.100'}
                            p={0.5}
                            pl={2}
                            pr={2}
                          >
                            {formatAddress(arch.profile.archAddress)}
                          </Text>
                        </HStack>
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
                            bg={'brand.100'}
                            p={0.5}
                            pl={2}
                            pr={2}
                          >
                            {ethers.utils.formatEther(arch.profile.minimumDiggingFee)}
                          </Text>
                        </Flex>
                      </Td>
                      <Td isNumeric>
                        <Flex justify="center">
                          <Text
                            ml={3}
                            bg={'brand.100'}
                            p={0.5}
                            pl={2}
                            pr={2}
                          >
                            {arch.profile.successes.toString()}
                          </Text>
                        </Flex>
                      </Td>
                      <Td isNumeric>
                        <Flex justify="center">
                          <Text
                            ml={3}
                            bg={'brand.100'}
                            p={0.5}
                            pl={2}
                            pr={2}
                          >
                            {arch.profile.cleanups.toString()}
                          </Text>
                        </Flex>
                      </Td>
                      {includeDialButton ? (
                        <Td>
                          <Button
                            disabled={isDialing || !!arch.connection}
                            onClick={() => testDialArchaeologist(arch.fullPeerId!)}
                          >
                            {arch.connection ? 'Connected' : 'Dial'}
                          </Button>
                        </Td>
                      ) : (
                        <></>
                      )}
                    </Tr>
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
