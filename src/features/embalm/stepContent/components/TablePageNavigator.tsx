import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Text, Flex, IconButton } from '@chakra-ui/react';

interface TablePageNavigatorProps {
  onClickPrevious: () => void;
  onClickNext: () => void;
  currentPage: number;
  totalPages: number;
}

export function TablePageNavigator({
  onClickPrevious,
  onClickNext,
  currentPage,
  totalPages,
}: TablePageNavigatorProps) {
  return (
    <Flex
      m={3}
      justify="flex-end"
      align="center"
    >
      <Text variant="secondary">
        Page {currentPage} of {totalPages}
      </Text>
      <IconButton
        ml={3}
        size="sm"
        variant="ghost"
        aria-label="Previous page"
        icon={<ArrowLeftIcon />}
        onClick={onClickPrevious}
      />
      <IconButton
        size="sm"
        variant="ghost"
        aria-label="Next page"
        icon={<ArrowRightIcon />}
        onClick={onClickNext}
      />
    </Flex>
  );
}
