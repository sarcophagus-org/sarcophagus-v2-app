import { Table, TableContainer, Tbody, Thead, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import { useGetSarcophagi } from '../hooks/useGetSarcophagi';
import { SarcoTableHead, SortDirection } from './SarcoTableHead';
import { SarcoTableRow } from './SarcoTableRow';

enum SortableColumn {
  State = 'state',
  Name = 'name',
  Resurrection = 'resurrection',
  None = 'none',
}

interface SarcoTableProps {
  ids?: string[];
}

/**
 * A table meant to be used to display sarcophagi with fixed column headers. Accepts sarcophagus ids
 * and pulls them from the contract.
 */
export function SarcoTable({ ids }: SarcoTableProps) {
  const [sortColumnId, setSortColumnId] = useState<SortableColumn>(SortableColumn.None);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.None);

  const sarcophagiWithoutIds = useGetSarcophagi(ids || []);
  const sarcophagi = sarcophagiWithoutIds?.map((sarcophagus, index) => ({
    ...sarcophagus,
    id: ids?.[index] || '',
  }));

  // Sort the sarcophagi using the sortColumnId and sortDirection states
  const sortedSarcophagi = sarcophagi?.sort((a, b) => {
    if (sortColumnId === SortableColumn.State) {
      if (sortDirection === SortDirection.Ascending) {
        return a.state > b.state ? 1 : -1;
      }
    } else if (sortColumnId === SortableColumn.Name) {
      if (sortDirection === SortDirection.Ascending) {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      } else if (sortDirection === SortDirection.Descending) {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
      }
    } else if (sortColumnId === SortableColumn.Resurrection) {
      if (sortDirection === SortDirection.Ascending) {
        return a.resurrectionTime.gt(b.resurrectionTime) ? 1 : -1;
      } else if (sortDirection === SortDirection.Descending) {
        return a.resurrectionTime.lt(b.resurrectionTime) ? 1 : -1;
      }
    }

    return 0;
  });

  /**
   * On first click, sort the selected column in ascending order
   * If column is sorted in ascending order, sort in descending order
   * If column is sorted in descending order, set sorting to none
   * If column is clicked while another column is sorted, clear sorting on the other column and sort the selected column in ascending order
   */
  function handleClickSort(columnId: SortableColumn) {
    if (sortColumnId !== columnId) {
      setSortColumnId(columnId);
      setSortDirection(SortDirection.Ascending);
    } else if (sortDirection === SortDirection.Ascending) {
      setSortDirection(SortDirection.Descending);
    } else if (sortDirection === SortDirection.Descending) {
      setSortColumnId(SortableColumn.None);
      setSortDirection(SortDirection.None);
    }
  }

  return (
    <TableContainer
      overflowY="auto"
      h="100%"
      minHeight="300px"
    >
      <Table
        variant="unstyled"
        size="sm"
      >
        <Thead
          position="sticky"
          top={0}
          bg="black"
          // Prevents buttons from appearing over the table header, 10,000 is an arbitrary number
          // that just so happens to work
          zIndex={10_000}
        >
          <Tr>
            <SarcoTableHead
              w={175}
              sortable
              sortDirection={
                sortColumnId === SortableColumn.State ? sortDirection : SortDirection.None
              }
              onClickSort={() => handleClickSort(SortableColumn.State)}
            >
              State
            </SarcoTableHead>
            <SarcoTableHead
              sortable
              sortDirection={sortColumnId === 'name' ? sortDirection : SortDirection.None}
              onClickSort={() => handleClickSort(SortableColumn.Name)}
            >
              Name
            </SarcoTableHead>
            <SarcoTableHead
              sortable
              sortDirection={
                sortColumnId === SortableColumn.Resurrection ? sortDirection : SortDirection.None
              }
              onClickSort={() => handleClickSort(SortableColumn.Resurrection)}
            >
              Resurrection
            </SarcoTableHead>
            <SarcoTableHead>Actions</SarcoTableHead>
            <SarcoTableHead>Details</SarcoTableHead>
          </Tr>
        </Thead>
        <Tbody>
          {sortedSarcophagi?.map(sarco => (
            <SarcoTableRow
              key={sarco.id}
              sarco={sarco}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
