import { Flex, IconButton, TableColumnHeaderProps, Text, Th } from '@chakra-ui/react';
import { DownIcon } from 'components/icons/DownIcon';
import { UpDownIcon } from 'components/icons/UpDownIcon';
import { UpIcon } from 'components/icons/UpIcon';

export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
  None = 'none',
}

interface SortableTableHeadProps extends TableColumnHeaderProps {
  sortable?: boolean;
  sortDirection?: SortDirection;
  onClickSort?: () => void;
  children: React.ReactNode;
}

/**
 * Custom TableHead component to be used in place of the default Th component. Adds a sort icon.
 * Supports sorting.
 */
export function SarcoTableHead({
  sortable,
  sortDirection,
  onClickSort,
  children,
  ...props
}: SortableTableHeadProps) {
  // If component not designated as sortable, return a non-sortable table header
  if (!sortable) {
    sortDirection = SortDirection.None;
  }

  const sortIconMap: { [key: string]: React.ReactElement } = {
    [SortDirection.None]: <UpDownIcon />,
    [SortDirection.Ascending]: <UpIcon />,
    [SortDirection.Descending]: <DownIcon />,
  };

  return (
    <Th
      border="none"
      {...props}
    >
      <Flex
        align="center"
        onClick={onClickSort}
        _hover={{
          cursor: sortable ? 'pointer' : 'default',
        }}
      >
        <Text
          textTransform="none"
          fontSize="sm"
        >
          {children}
        </Text>
        {sortable && (
          <IconButton
            variant="unstyled"
            size="xs"
            aria-label="Sort"
            icon={sortIconMap[sortDirection || SortDirection.None]}
          />
        )}
      </Flex>
    </Th>
  );
}
