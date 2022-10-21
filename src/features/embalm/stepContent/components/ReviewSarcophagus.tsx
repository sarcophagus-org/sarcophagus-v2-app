import {
  Box,
  Flex,
  Highlight,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useStepNavigator } from '../../stepNavigator/hooks/useStepNavigator';
import { useSarcophagusParameters } from '../hooks/useSarcophagusParameters';
import { SummaryErrorIcon } from './SummaryErrorIcon';
import { useSelector } from '../../../../store';
import { useGetProtocolFeeAmount } from '../../../../hooks/viewStateFacet';

export function ReviewSarcophagus() {
  const { sarcophagusParameters } = useSarcophagusParameters();
  const { selectStep } = useStepNavigator();
  const { diggingFees, uploadPrice } = useSelector(x => x.embalmState);
  const protocolFees = useGetProtocolFeeAmount();

  return (
    <VStack
      align="left"
      spacing={6}
      mt={4}
    >
      <Text>
        Review your details below. Once you are ready, you can submit your transactions. Be aware,
        you will make two transactions: (1) encrypt your payload, and (2) upload your payload to
        Arweave via Bundlr.
      </Text>

      <Flex
        flex={4}
        height="100%"
        direction="column"
      >
        <Box
          py={3}
          bgGradient="linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
        >
          <Text
            width="full"
            textAlign="center"
          >
            Sarcophagus Summary
          </Text>
        </Box>
        <Table variant="unstyled">
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
                      {error && <SummaryErrorIcon />}
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

        <Box
          py={3}
          bgGradient="linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
        >
          <Flex direction="column">
            <Text>Fees</Text>
            <Text width="full">uploadPrice: {uploadPrice}</Text>
            <Text width="full">diggingFees: {diggingFees}</Text>
            <Text width="full">protocolFees: {protocolFees}</Text>
          </Flex>
        </Box>
      </Flex>
    </VStack>
  );
}
