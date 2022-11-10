import {
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationSeparator,
  PaginationPrevious,
  PaginationPageGroup,
} from '@ajna/pagination';
import {
  Flex,
  Text,
  Select,
  HStack,
  Icon,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { ChevronLeftIcon, ChevronRightIcon, QuestionIcon } from '@chakra-ui/icons';
import { SummaryErrorIcon } from '../components/SummaryErrorIcon';

export function ArchaeologistPagination() {
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

  return (
    <Flex>
      <Flex px={3}>
        <HStack direction="row"></HStack>
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
    </Flex>
  );
}
