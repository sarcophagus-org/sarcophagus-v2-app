import { Box, Flex, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
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
        <Box py={3}  bgGradient='linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)'>
          <Text  width='full' textAlign='center'>Sarcophagus Summary</Text>
        </Box>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>
                <VStack align='left'>
                  <Text>
                    Item
                  </Text>
                </VStack>
              </Th>
              <Th>
                <VStack align='left'>
                  <Text>
                    Details
                  </Text>
                </VStack>
              </Th>
              <Th>
                <VStack align='left'>
                  <Text>
                    Action
                  </Text>
                </VStack>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sarcophagusParameters.map(({ name, value, step }) => {
              return (
                <Tr key={name}>
                  <Td py={2}>{name}</Td>
                  <Td py={2}>
                    <Text color={value === null ? 'red' : 'white'}>{value || '--'}</Text>
                  </Td>
                  <Td py={2}
                      cursor='pointer'
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

        <Box py={3}  bgGradient='linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)'>
          <Text  width='full' textAlign='center'>Fees</Text>
        </Box>
      </Flex>
    </VStack>
  );
}
