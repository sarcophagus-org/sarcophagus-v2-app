import {
  Flex,
  VStack,
  IconButton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { formatAddress } from 'lib/utils/helpers';
import useSarcophagi from 'hooks/useSarcophagi';
import { useParams, NavLink } from 'react-router-dom';
import { SarcophagusDetail } from './SarcophagusDetail';

export function Dashboard() {
  const { sarcophagi, updateSarcophagi } = useSarcophagi();
  const { id } = useParams();

  return (
    <Flex
      ml="84px"
      w="65%"
      py="48px"
      minWidth="700px"
      direction="column"
      height="100%"
    >
      {!!id ? (
        <VStack
          align="left"
          pl={20}
        >
          <SarcophagusDetail id={id} />
        </VStack>
      ) : (
        <VStack>
          <IconButton
            alignSelf="flex-end"
            size="sm"
            variant="ghost"
            aria-label="Previous page"
            icon={<RepeatIcon />}
            onClick={updateSarcophagi}
          />
          <TableContainer
            width="100%"
            overflowY="auto"
            maxHeight="650px"
          >
            <Table>
              <Thead>
                <Tr>
                  <Th>Sarco ID</Th>
                  <Th>Name</Th>
                  <Th>State</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sarcophagi.map((s, index) => (
                  <Tr key={index}>
                    <Td>
                      <Link
                        as={NavLink}
                        to={s.sarcoId}
                      >
                        {formatAddress(s.sarcoId)}
                      </Link>
                    </Td>
                    <Td>{s.name}</Td>
                    <Td>{s.state}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      )}
    </Flex>
  );
}
