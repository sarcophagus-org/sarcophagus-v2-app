import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useStepNavigator } from 'features/embalm/stepNavigator/hooks/useStepNavigator';
import { maxSarcophagusNameLength } from 'lib/constants';
import { SarcophagusParameter } from '../hooks/useSarcophagusParameters';
import { SummaryErrorIcon } from './SummaryErrorIcon';

interface ReviewSarcophagusTableProps {
  sarcophagusParameters: SarcophagusParameter[];
}

export function ReviewSarcophagusTable({ sarcophagusParameters }: ReviewSarcophagusTableProps) {
  const { selectStep } = useStepNavigator();
  return (
    <Table
      variant="unstyled"
      my={3}
    >
      <Thead>
        <Tr>
          {/* Fits content */}
          <Th w={0}>
            <Text textTransform="none">Item</Text>
          </Th>
          {/* Expands as much as possible */}
          <Th>
            <Text textTransform="none">Details</Text>
          </Th>
          {/* Fits content */}
          <Th w={0}>
            <Text textTransform="none">Action</Text>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {sarcophagusParameters.map(({ name, value, step, error }) => {
          const foramttedValue = !value
            ? '----'
            : value.length > maxSarcophagusNameLength
            ? `${value.slice(0, maxSarcophagusNameLength - 4)}...`
            : value;

          return (
            <Tr key={name}>
              <Td py={3}>
                <Flex alignItems="center">
                  <Text
                    whiteSpace="nowrap"
                    px={2}
                    py={0.5}
                    mr={2}
                    rounded="sm"
                    bg={error ? 'background.red' : 'grayBlue.950'}
                  >
                    {name}
                  </Text>

                  {error && <SummaryErrorIcon error={error} />}
                </Flex>
              </Td>
              <Td
                maxW={100}
                py={2}
              >
                <Text
                  as="span"
                  px={2}
                  py={0.5}
                  rounded="sm"
                  bg={error ? 'background.red' : 'grayBlue.950'}
                >
                  {foramttedValue}
                </Text>
              </Td>
              <Td
                py={2}
                cursor="pointer"
                textTransform="uppercase"
                _hover={{
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  selectStep(step);
                }}
              >
                Edit
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
