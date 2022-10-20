import { Box, Flex, Heading, Highlight, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { useStepNavigator } from '../../stepNavigator/hooks/useStepNavigator';

export function ReviewSarcophagus() {
  const { sarcophagusParameters } = useSarcophagusParameters();
  const { selectStep } = useStepNavigator();

  return (
    <VStack
      align='left'
      spacing={6}
      mt={4}
    >
      <Text>Review your details below. Once you are ready, you can submit your transactions. Be aware, you will make two
        transactions: (1) encrypt your payload, and (2) upload your payload to Arweave via Bundlr.</Text>

      <Flex
        flex={4}
        height='100%'
        direction='column'
      >
        <Box py={3} bgGradient='linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)'>
          <Text width='full' textAlign='center'>Sarcophagus Summary</Text>
        </Box>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>
                <VStack align='left'>
                  <Text textTransform='none'>
                    Item
                  </Text>
                </VStack>
              </Th>
              <Th>
                <VStack align='left'>
                  <Text textTransform='none'>
                    Details
                  </Text>
                </VStack>
              </Th>
              <Th>
                <VStack align='left'>
                  <Text textTransform='none'>
                    Action
                  </Text>
                </VStack>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sarcophagusParameters.map(({ name, value, step, error }) => {
              return (
                <Tr key={name}>
                  <Td py={2}>
                    <Highlight query={name} styles={{ rounded: 'sm', bg: 'brand.200', px: '1' }}>
                      {name}
                    </Highlight>
                  </Td>
                  <Td py={2}>
                    {error ?
                      <Text>
                        <Highlight query={value || '--'} styles={{ rounded: 'sm', bg: 'red', opacity: '15%', px: '1' }}>
                          {value || '--'}
                        </Highlight></Text>
                      : <Text>{value}</Text>
                    }
                  </Td>
                  <Td py={2}
                      cursor='pointer'
                      textTransform='uppercase'
                      _hover={{
                        textDecoration: 'underline'
                      }} onClick={() => {
                    selectStep(step);
                  }}>Edit</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        <Box py={3} bgGradient='linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)'>
          <Text width='full' textAlign='center'>Fees</Text>
        </Box>
      </Flex>
    </VStack>
  );
}
