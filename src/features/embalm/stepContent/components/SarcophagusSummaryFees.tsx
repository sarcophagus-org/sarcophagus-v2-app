import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber } from 'ethers';

export interface SummaryFeesProps {
  totalFees: BigNumber;
  formattedTotalDiggingFees: string;
  protocolFee: BigNumber;
  totalCurseFees: BigNumber;
  protocolFeeBasePercentage: string;
}

export function SarcophagusSummaryFees({
  totalFees,
  formattedTotalDiggingFees,
  protocolFee,
  totalCurseFees,
  protocolFeeBasePercentage,
}: SummaryFeesProps) {
  return (
    <Box
      py={4}
      bgGradient="linear(rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.09) 100%)"
    >
      <Flex
        justifyContent="flex-end"
        px={6}
      >
        <Flex
          w={275}
          direction="column"
        >
          <Flex
            w="100%"
            justifyContent="space-between"
          >
            <Text as="i">Digging Fee</Text>
            <Text as="i">{formattedTotalDiggingFees} SARCO</Text>
          </Flex>
          <Flex
            w="100%"
            justifyContent="space-between"
          >
            <Text as="i">Curse Fee</Text>
            <Text as="i">{sarco.utils.formatSarco(totalCurseFees.toString())} SARCO</Text>
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
              + {Number(protocolFeeBasePercentage) / 100}% protocol fee
            </Text>
            <Text
              as="i"
              variant="secondary"
              fontSize="xs"
            >
              {sarco.utils.formatSarco(protocolFee.toString())} SARCO
            </Text>
          </Flex>
          <Flex
            w="100%"
            justifyContent="space-between"
          ></Flex>
          <Divider
            my={2}
            borderColor="brand.300"
          />
          <Flex
            w="100%"
            justifyContent="space-between"
          >
            <Text
              as="i"
              fontSize="16"
              fontWeight="bold"
            >
              Total:
            </Text>
            <Text
              as="i"
              fontSize="16"
              fontWeight="bold"
            >
              {sarco.utils.formatSarco(totalFees.toString(), 4)} SARCO
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
