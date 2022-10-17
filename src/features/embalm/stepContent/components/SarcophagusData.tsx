import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useSarcophagusData } from '../hooks/useSarcophagusData';

export function SarcophagusData() {
  const { sarcophagusDataMap } = useSarcophagusData();

  return (
    <VStack
      align='left'
      spacing={6}
      mt={4}
    >
      <Text>
        Sarcophagus Summary
      </Text>
      <Flex
        flex={4}
        height='100%'
        direction='column'
      >
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>
                <VStack align='left'>
                  <Text
                    variant='secondary'
                    py={3}
                  >
                    Item
                  </Text>
                </VStack>
              </Th>
              <Th>
                <VStack align='left'>
                  <Text
                    variant='secondary'
                    py={3}
                  >
                    Details
                  </Text>
                </VStack>
              </Th>
              <Th>
                <VStack align='left'>
                  <Text
                    variant='secondary'
                    py={3}
                  >
                    Action
                  </Text>
                </VStack>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              Array.from(sarcophagusDataMap).map((mapRow) => {
                const dataVal = mapRow[0];
                const dataKey = mapRow[1];
                return (
                  <Tr
                    key={dataKey}
                  >
                    <Td>
                      {dataVal}
                    </Td>
                    <Td>
                      {dataKey}
                    </Td>
                    <Td>
                      Edit
                    </Td>
                  </Tr>
                );
              })
            }
          </Tbody>
        </Table>
      </Flex>
    </VStack>
  );
}