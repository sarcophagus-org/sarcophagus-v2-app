import {
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { SummaryErrorIcon } from '../components/SummaryErrorIcon';
import { ArchaeologistList } from '../components/ArchaeologistList';
import { ArchaeologistHeader } from '../components/ArchaeologistHeader';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationSeparator,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { ChevronLeftIcon, ChevronRightIcon, QuestionIcon } from '@chakra-ui/icons';
import { Resurrection } from '../components/Resurrection';
import { useSelector } from 'store/index';
import { Select, OptionBase, GroupBase, SelectInstance } from 'chakra-react-select';
import moment from 'moment';

interface IPageSizeSetByOption extends OptionBase {
  value: number;
  label: string;
}

export function SelectArchaeologists() {
  const outerLimit = 1;
  const innerLimit = 1;
  const { sortedFilteredArchaeologist } = useArchaeologistList();
  const { resurrection } = useSelector(x => x.embalmState);

  const ref = useRef<SelectInstance>(null);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const toggleMenuIsOpen = () => {
    setMenuIsOpen(value => !value);
    const selectEl = ref.current;
    if (!selectEl) return;
    if (menuIsOpen) selectEl.blur();
    else selectEl.focus();
  };

  const [selectedOption, setSelectedOption] = useState<number>(5);

  const { currentPage, setCurrentPage, pagesCount, pages, pageSize, setPageSize, offset } =
    usePagination({
      total: sortedFilteredArchaeologist.length,
      initialState: { currentPage: 1, pageSize: 5 },
      limits: {
        outer: outerLimit,
        inner: innerLimit,
      },
    });

  const paginatedArchaeologist = sortedFilteredArchaeologist.slice(offset, offset + pageSize);

  const PageSizeOptionsMap: IPageSizeSetByOption[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
  ];

  function handlePageSizeChange(newValue: IPageSizeSetByOption | null) {
    const newPageSize = newValue!.value;
    setPageSize(newPageSize!);
    setSelectedOption(newPageSize);
  }

  const handlePageChange = (nextPage: number): void => {
    setCurrentPage(nextPage);
  };

  const resurrectionDate = new Date(resurrection);

  return (
    <Flex
      direction="column"
      width="100%"
    >
      <Heading>Archaeologists</Heading>
      <Text
        variant="primary"
        mt="4"
        fontSize="16px"
      >
        Resurrection Time
      </Text>
      <HStack>
        <>
          <Text
            variant="primary"
            color="brand.600"
          >
            Currently set:{' '}
            <Text
              as="u"
              color="brand.600"
            >
              {moment(resurrectionDate).format('DD.MM.YY h:mma')}
            </Text>
          </Text>

          <Text
            as="i"
            color="brand.900"
            onClick={() => {
              toggleMenuIsOpen();
            }}
            cursor="pointer"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            ({menuIsOpen ? 'hide' : 'edit'})
          </Text>
        </>
      </HStack>
      {menuIsOpen && (
        <Resurrection
          mt={5}
          w={'50%'}
        />
      )}
      <ArchaeologistHeader />
      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      >
        <PaginationContainer
          p={4}
          w="full"
        >
          <VStack>
            <ArchaeologistList paginatedArchaeologist={paginatedArchaeologist} />
            <Box w={'100%'}>
              <Flex justifyContent={'space-between'}>
                <Flex px={3}>
                  <HStack direction="row">
                    <HStack>
                      <Text color="brand.600">Items per page:</Text>
                      <Box cursor="pointer">
                        <Select<IPageSizeSetByOption, false, GroupBase<IPageSizeSetByOption>>
                          value={PageSizeOptionsMap.filter(function (option) {
                            return option.value === selectedOption;
                          })}
                          onChange={handlePageSizeChange}
                          placeholder=""
                          options={PageSizeOptionsMap}
                          isSearchable={false}
                          focusBorderColor="transparent"
                          selectedOptionColor="brand.950"
                          useBasicStyles
                          chakraStyles={{
                            menu: provided => ({
                              ...provided,
                              my: '-0.3rem',
                            }),

                            menuList: provided => ({
                              ...provided,
                              bg: 'brand.0',
                              fontSize: '14px',
                              borderColor: 'violet.700',
                            }),

                            option: (provided, state) => ({
                              ...provided,
                              background: state.isFocused ? 'brand.100' : provided.background,
                              fontSize: '14px',
                              color: 'brand.600',
                              my: '-0.4rem',
                            }),

                            control: provided => ({
                              ...provided,
                              my: '-1rem',
                              marginLeft: '-0.6rem',
                              w: '75px',
                              bg: 'brand.0',
                              color: 'brand.600',
                              borderColor: 'transparent',
                              _hover: {
                                borderColor: 'transparent',
                              },
                              fontSize: '14px',
                            }),
                          }}
                        />
                      </Box>
                    </HStack>
                  </HStack>
                </Flex>

                <Flex>
                  <PaginationPrevious
                    backgroundColor={'transparent'}
                    color="brand.950"
                    variant={'paginator'}
                  >
                    <Icon
                      as={ChevronLeftIcon}
                      color="brand.950"
                      w={6}
                      h={6}
                      mr={1}
                    ></Icon>
                    Prev
                  </PaginationPrevious>
                  <PaginationPageGroup
                    isInline
                    align="center"
                    separator={
                      <PaginationSeparator
                        bg="brand.0"
                        textColor={'brand.950'}
                        fontSize="sm"
                        w={7}
                        jumpSize={1}
                      />
                    }
                  >
                    {pages.map((page: number) => (
                      <PaginationPage
                        bg="brand.0"
                        key={`pagination_page_${page}`}
                        textColor={'brand.950'}
                        page={page}
                        fontSize="sm"
                        variant={'paginator'}
                        _hover={{
                          bg: 'white',
                          textColor: 'brand.50',
                        }}
                        _current={{
                          bg: '#D9D9D9',
                          fontSize: 'sm',
                          textColor: 'brand.50',
                        }}
                      />
                    ))}
                  </PaginationPageGroup>
                  <PaginationNext
                    backgroundColor={'transparent'}
                    color="brand.950"
                    variant={'paginator'}
                  >
                    Next
                    <Icon
                      as={ChevronRightIcon}
                      color="brand.950"
                      w={6}
                      h={6}
                      mr={1}
                    ></Icon>
                  </PaginationNext>
                </Flex>

                <HStack mr={2}>
                  <Text variant="secondary">Show (10) hidden</Text>
                  <Popover trigger={'hover'}>
                    <PopoverTrigger>
                      <Icon
                        as={QuestionIcon}
                        color="brand.500"
                        w={2}
                        h={2}
                      ></Icon>
                    </PopoverTrigger>
                    <PopoverContent background="black">
                      <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              </Flex>

              <HStack
                mr={2}
                mt={3}
              >
                <SummaryErrorIcon
                  error={
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                  }
                />
                <Text
                  ml={2}
                  color="brand.500"
                  textAlign={'center'}
                >
                  = accused archaeologists
                </Text>
                <Text
                  text-align={'bottom'}
                  as="i"
                  fontSize={'12'}
                >
                  (show)
                </Text>
              </HStack>
            </Box>
          </VStack>
        </PaginationContainer>
      </Pagination>
    </Flex>
  );
}
