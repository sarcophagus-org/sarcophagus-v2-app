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
import { ArchaeologistPagination } from '../components/ArchaeologistPagination';
import { ArchaeologistList } from '../components/ArchaeologistList';
import { ArchaeologistHeader } from '../components/ArchaeologistHeader';
import { Pagination, PaginationContainer, usePagination } from '@ajna/pagination';
import { useArchaeologistList } from '../hooks/useArchaeologistList';

import { QuestionIcon } from '@chakra-ui/icons';

export function SelectArchaeologists() {
  const outerLimit = 1;
  const innerLimit = 1;
  const { sortedFilteredArchaeologist } = useArchaeologistList();

  const { currentPage, setCurrentPage, pagesCount, pageSize, setPageSize, offset } = usePagination({
    total: sortedFilteredArchaeologist.length,
    initialState: { currentPage: 1, pageSize: 5 },
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
  });

  const paginatedArchaeologist = sortedFilteredArchaeologist.slice(offset, offset + pageSize);

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
            <ArchaeologistList paginatedArchaeologist={paginatedArchaeologist} />
            <Box w={'100%'}>
              <Flex justifyContent={'space-between'}>
                <Flex
                  px={3}
                  justifyContent={'space-between'}
                >
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

                <ArchaeologistPagination />

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
            </Box>
          </VStack>
        </PaginationContainer>
      </Pagination>
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
    </Flex>
  );
}
