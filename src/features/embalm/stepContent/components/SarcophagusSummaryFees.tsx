import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, Text, Tooltip } from '@chakra-ui/react';
import { useGetProtocolFeeAmount } from 'hooks/viewStateFacet';
import { formatFee, sumDiggingFeesFormatted } from 'lib/utils/helpers';
import { useSelector } from 'store/index';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { BigNumber, ethers } from 'ethers';

export function SarcophagusSummaryFees() {
  const { uploadPrice, selectedArchaeologists } = useSelector(x => x.embalmState);
  const protocolFeeBasePercentage = useGetProtocolFeeAmount();

  const diggingFees = sumDiggingFeesFormatted(selectedArchaeologists);

  // protocolFeeBasePercentage is pulled from the chain, temp show 0 until it loads
  const protocolFee = protocolFeeBasePercentage
    ? parseEther(diggingFees).div(BigNumber.from(100 * protocolFeeBasePercentage))
    : BigNumber.from(0);

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
          <Tooltip
            label="Fee to be paid on each rewrap, and a one time upload fee"
            placement="top"
          >
            <InfoOutlineIcon fontSize="md" />
          </Tooltip>
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
            <Text as="i">{diggingFees} SARCO</Text>
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
              {formatEther(protocolFee)} SARCO
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
            <Text as="i">{formatFee(ethers.utils.formatUnits(uploadPrice), 4)} ETH</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
