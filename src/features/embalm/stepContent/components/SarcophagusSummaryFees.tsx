import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { useGetProtocolFeeAmount } from 'hooks/viewStateFacet';
import { formatFee, sumDiggingFees } from 'lib/utils/helpers';
import { useSelector } from 'store/index';

export function SarcophagusSummaryFees() {
  const { uploadPrice, selectedArchaeologists } = useSelector(x => x.embalmState);
  const protocolFeeBasePercentage = useGetProtocolFeeAmount();

  const diggingFees = sumDiggingFees(selectedArchaeologists).toNumber();
  const protocolFee = diggingFees / (100 * protocolFeeBasePercentage);

  return (
    <Box
      py={4}
      bgGradient="linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
    >
      <Flex
        justifyContent="space-between"
        px={6}
      >
        <Flex alignItems="center">
          <InfoOutlineIcon fontSize="md" />
          <Text
            ml={2}
            fontSize="sm"
          >
            Fees
          </Text>
        </Flex>
        <Flex
          w={275}
          direction="column"
        >
          <Flex
            w="100%"
            justifyContent="space-between"
          >
            <Text as="i">Digging Fee</Text>
            <Text as="i">{sumDiggingFees(selectedArchaeologists).toString()} SARCO</Text>
          </Flex>
          <Flex
            w="100%"
            justifyContent="space-between"
          >
            <Text
              as="i"
              variant="secondary"
              fontSize="xs"
            >
              + {protocolFeeBasePercentage}% protocol fee
            </Text>
            <Text
              as="i"
              variant="secondary"
              fontSize="xs"
            >
              {formatFee(protocolFee)} SARCO
            </Text>
          </Flex>
          <Divider
            my={2}
            borderColor="brand.300"
          />
          <Flex
            w="100%"
            justifyContent="space-between"
          >
            <Text as="i">Payload Upload</Text>
            <Text as="i">{formatFee(uploadPrice, 4)} ETH</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
