import {
  Flex,
  Heading,
  Text,
  VStack,
  Select,
  HStack,
  Icon,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
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

export function SelectArchaeologists() {
  const outerLimit = 1;
  const innerLimit = 1;
  const { sortedFilteredArchaeologist } = useArchaeologistList();

  const { currentPage, setCurrentPage, pagesCount, pages, pageSize, setPageSize, offset } =
    usePagination({
      total: sortedFilteredArchaeologist.length,
      initialState: { currentPage: 1, pageSize: 5 },
      limits: {
        outer: outerLimit,
        inner: innerLimit,
      },
    });

  // TODO: Rename paginated archs? paginatedArchaeologist
  const currentPageData = sortedFilteredArchaeologist.slice(offset, offset + pageSize);

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
  };

  const handlePageChange = (nextPage: number): void => {
    setCurrentPage(nextPage);
  };

  return (
    <Flex
      direction="column"
      width="100%"
    >
      <Heading>Select Archaeologists</Heading>
      <Text
        variant="primary"
        mt="6"
      >
        Resurrection Time
      </Text>
      <Text
        variant="primary"
        mt="2"
      >
        Currently set: 09.22.22 7:30pm (edit)
      </Text>
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
            <ArchaeologistList currentPageData={currentPageData} />
            <Box w={'100%'}>
              <Flex justifyContent={'space-between'}>
                <Flex px={3}>
                  <HStack direction="row">
                    <HStack>
                      <Text color="brand.600">Items per page:</Text>
                      <Select
                        size="sm"
                        onChange={handlePageSizeChange}
                        w={14}
                        textAlign={'right'}
                        variant="unstyled"
                        color="brand.600"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </Select>
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
                          bg: 'brand.950',
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
