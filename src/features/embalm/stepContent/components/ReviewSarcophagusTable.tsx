import { Flex, Highlight, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useStepNavigator } from 'features/embalm/stepNavigator/hooks/useStepNavigator';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { SummaryErrorIcon } from './SummaryErrorIcon';

export function ReviewSarcophagusTable() {
  const { sarcophagusParameters } = useSarcophagusParameters();
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
          return (
            <Tr key={name}>
              <Td py={3}>
                <Flex alignItems="center">
                  <Highlight
                    query={name}
                    styles={{
                      rounded: 'sm',
                      bg: `${error ? 'errorAlt' : 'brand.100'}`,
                      px: '2',
                      py: '2px',
                      color: 'brand.950',
                    }}
                  >
                    {name}
                  </Highlight>
                  <Flex ml={3}>{error && <SummaryErrorIcon error={error} />}</Flex>
                </Flex>
              </Td>
              <Td py={2}>
                <Text>
                  <Highlight
                    query={value || '----'}
                    styles={{
                      rounded: 'sm',
                      bg: `${error ? 'errorAlt' : 'brand.100'}`,
                      px: '2',
                      py: '2px',
                      color: 'brand.950',
                    }}
                  >
                    {value || '----'}
                  </Highlight>
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
