import { Flex, Heading, Text, VStack, HStack, Icon, Box, Tooltip, chakra } from '@chakra-ui/react';
import { useState } from 'react';
import { SummaryErrorIcon } from '../components/SummaryErrorIcon';
import { ArchaeologistList } from '../components/ArchaeologistList';
import { SetPaginationSize, IPageSizeSetByOption } from '../components/SetPaginationSize';
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
import { SetResurrection } from '../components/SetResurrection';
import { useSelector } from 'store/index';
import moment from 'moment';
import { PageBlockModal } from '../components/PageBlockModal';

export function SelectArchaeologists({
  hideHeader = false,
  showDial = false,
}: {
  hideHeader?: boolean;
  showDial?: boolean;
}) {
  const outerLimit = 1;
  const innerLimit = 1;
  const { sortedFilteredArchaeologist, showSelectedArchaeologists, hiddenArchaeologists } =
    useArchaeologistList();
  const { resurrection } = useSelector(x => x.embalmState);
  const [resurrectionTimeEdit, setResurrectionTimeEdit] = useState<boolean>(false);
  const [paginationSize, setPaginationSize] = useState<number>(5);

  const { currentPage, setCurrentPage, pagesCount, pages, pageSize, setPageSize, offset } =
    usePagination({
      total: sortedFilteredArchaeologist(showSelectedArchaeologists).length,
      initialState: { currentPage: 1, pageSize: 5 },
      limits: {
        outer: outerLimit,
        inner: innerLimit,
      },
    });

  const paginatedArchaeologist = sortedFilteredArchaeologist(showSelectedArchaeologists).slice(
    offset,
    offset + pageSize
  );
  const resurrectionDate = new Date(resurrection);

  const handlePageChange = (nextPage: number): void => {
    setCurrentPage(nextPage);
  };

  const returnToFirstPage = () => {
    setCurrentPage(1);
  };

  function handlePageSizeChange(newValue: IPageSizeSetByOption | null) {
    const newPageSize = newValue!.value;
    setPageSize(newPageSize!);
    setPaginationSize(newPageSize);
  }

  return (
    <Flex
      direction="column"
      width="100%"
    >
      {!hideHeader ?? <Heading>Archaeologists</Heading>}
      <Text
        mt="4"
        fontSize="lg"
      >
        Resurrection Time
      </Text>
      <HStack>
        <>
          <Text variant="secondary">
            Currently set:
            {!resurrection ? (
              ' Resurrection time not set'
            ) : (
              <chakra.span
                textDecor="underline"
                ml={2}
              >
                {moment(resurrectionDate).format('DD.MM.YY h:mma')}
              </chakra.span>
            )}
          </Text>
          <Text
            as="i"
            onClick={() => {
              setResurrectionTimeEdit(prevValue => !prevValue);
            }}
            cursor="pointer"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            ({resurrectionTimeEdit ? 'hide' : 'edit'})
          </Text>
        </>
      </HStack>
      {resurrectionTimeEdit && (
        <SetResurrection
          mt={5}
          w={'450px'}
        />
      )}
      <ArchaeologistHeader resetPage={returnToFirstPage} />
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
            <ArchaeologistList
              paginatedArchaeologist={paginatedArchaeologist}
              showDial={showDial}
            />
            <Box w={'100%'}>
              <Flex justifyContent={'space-between'}>
                <Flex px={3}>
                  <HStack direction="row">
                    <HStack>
                      <Text variant="secondary">Items per page:</Text>
                      <SetPaginationSize
                        handlePageSizeChange={handlePageSizeChange}
                        paginationSize={paginationSize}
                      ></SetPaginationSize>
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

                {hiddenArchaeologists.length > 0 ? (
                  <HStack mr={2}>
                    <Text variant="secondary">
                      {hiddenArchaeologists.length} Hidden Archaeologists
                    </Text>
                    <Tooltip
                      placement="top"
                      label="These archeologists are hidden because they are not available by your resurrection time. Adjust your resurrection time to include them."
                    >
                      <Icon
                        as={QuestionIcon}
                        color="brand.500"
                        w={3}
                        h={3}
                      />
                    </Tooltip>
                  </HStack>
                ) : (
                  <Box w="200px" />
                )}
              </Flex>

              <HStack
                mr={2}
                mt={3}
              >
                <SummaryErrorIcon />
                <Text
                  ml={2}
                  variant="secondary"
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
      <PageBlockModal />
    </Flex>
  );
}
