import { Flex, Heading, Text, VStack, Select } from '@chakra-ui/react';
import React, { FC, ChangeEvent, useEffect, useState } from 'react';

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

export function SelectArchaeologists() {
  const [archsTotal, setArchsTotal] = useState<number | undefined>(undefined);
  const [archs, setArchs] = useState<any[]>([]);

  // constants
  const outerLimit = 1;
  const innerLimit = 1;
  const { sortedFilteredArchaeologist } = useArchaeologistList();

  const { currentPage, setCurrentPage, pagesCount, pages, pageSize, setPageSize, offset } =
    usePagination({
      total: sortedFilteredArchaeologist.length,
      pagesCount: 3,
      initialState: { currentPage: 1, pageSize: 3 },
      limits: {
        outer: outerLimit,
        inner: innerLimit,
      },
    });

  console.log('offset', offset);
  console.log('sortedFilteredArchaeologist', sortedFilteredArchaeologist);

  // fetchUsingOffset(pageSize, offset).then(data => {
  //   // use data
  // });

  const currentPageData = sortedFilteredArchaeologist.slice(offset, offset + pageSize);
  console.log('currentPageData', currentPageData);

  // const fetchPokemons = async (
  //   pageSize: number,
  //   offset: number
  // ): Promise<any> => {
  //   return await fetch(
  //     `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`
  //   ).then(async (res) => await res.json());
  // };

  // fetchArchs(pageSize, offset).then(data => {
  //   console.log(data);
  // });

  // useEffect(() => {
  //   fetchArchs(pageSize, offset).then(data => {
  //     console.log(data);
  //   });
  // }, []);

  // effects
  // useEffect(() => {
  //   fetchPokemons(pageSize, offset)
  //     .then((pokemons) => {
  //       setPokemonsTotal(pokemons.count);
  //       setPokemons(pokemons.results);
  //     })
  //     .catch((error) => console.log("App =>", error));
  // }, [currentPage, pageSize, offset]);

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
      <ArchaeologistHeader></ArchaeologistHeader>
      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      >
        <PaginationContainer justify="space-between">
          <VStack>
            <ArchaeologistList currentPageData={currentPageData} />
            <Flex>
              <PaginationPrevious>Previous</PaginationPrevious>
              <PaginationPageGroup
                isInline
                align="center"
                separator={
                  <PaginationSeparator
                    border-style={'solid'}
                    border-color={'red'}
                    onClick={() =>
                      console.log(
                        'Im executing my own function along with Separator component functionality'
                      )
                    }
                    bg="blue.300"
                    fontSize="sm"
                    w={7}
                    jumpSize={1}
                  />
                }
              >
                {pages.map((page: number) => (
                  <PaginationPage
                    w={7}
                    bg="red.300"
                    key={`pagination_page_${page}`}
                    page={page}
                    onClick={() =>
                      console.log(
                        'Im executing my own function along with Page component functionality'
                      )
                    }
                    fontSize="sm"
                    _hover={{
                      bg: 'green.300',
                    }}
                    _current={{
                      bg: 'green.300',
                      fontSize: 'sm',
                      w: 7,
                    }}
                  />
                ))}
              </PaginationPageGroup>
              <PaginationNext>Next</PaginationNext>
            </Flex>
          </VStack>
        </PaginationContainer>
      </Pagination>
      <Select
        ml={3}
        onChange={handlePageSizeChange}
        w={20}
        textAlign={'right'}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </Select>
    </Flex>
  );
}
