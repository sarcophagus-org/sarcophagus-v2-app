import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, Text, Tooltip } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { useGetProtocolFeeBasePercentage } from 'hooks/viewStateFacet';
import { formatFee, formatSarco, getTotalFeesInSarco } from 'lib/utils/helpers';
import { useSelector } from 'store/index';
import { SummaryErrorIcon } from './SummaryErrorIcon';

export function SarcophagusSummaryFees() {
  const { uploadPrice, selectedArchaeologists, resurrection } = useSelector(x => x.embalmState);
  const protocolFeeBasePercentage = useGetProtocolFeeBasePercentage();
  const { balance } = useSarcoBalance();
  const { timestampMs } = useSelector(x => x.appState);

  const { formattedTotalDiggingFees, totalDiggingFees } = getTotalFeesInSarco(
    resurrection,
    selectedArchaeologists.map(a => a.profile.minimumDiggingFeePerSecond),
    timestampMs,
    protocolFeeBasePercentage
  );

  const totalCurseFees = selectedArchaeologists.reduce((acc, archaeologist) => {
    return acc.add(archaeologist.profile.curseFee);
  }, BigNumber.from(0));

  const diggingFeesAndCurseFees = totalDiggingFees.add(totalCurseFees);
  const protocolFee =
    diggingFeesAndCurseFees.gt(0) && protocolFeeBasePercentage
      ? diggingFeesAndCurseFees.div(BigNumber.from(10000).div(BigNumber.from(protocolFeeBasePercentage)))
      : BigNumber.from(0);

  const totalFees = diggingFeesAndCurseFees.add(protocolFee);

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
          {balance?.lt(totalDiggingFees.add(protocolFee)) ? (
            <SummaryErrorIcon error={"You don't have enough SARCO to cover creation fees!"} />
          ) : (
            <Tooltip
              label="Fee to be paid for the next rewrap, and a one time upload fee"
              placement="top"
            >
              <InfoOutlineIcon fontSize="md" />
            </Tooltip>
          )}
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
            <Text as="i">{formattedTotalDiggingFees} SARCO</Text>
          </Flex>
          <Flex
            w="100%"
            justifyContent="space-between"
          >
            <Text as="i">Curse Fee</Text>
            <Text as="i">{formatSarco(totalCurseFees.toString())} SARCO</Text>
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
              + {protocolFeeBasePercentage / 100}% protocol fee
            </Text>
            <Text
              as="i"
              variant="secondary"
              fontSize="xs"
            >
              {formatSarco(protocolFee.toString())} SARCO
            </Text>
          </Flex>
          <Flex
            w="100%"
            justifyContent="space-between"
          >
            <Text as="i">Total Fees</Text>
            <Text as="i">{formatSarco(totalFees.toString())} SARCO</Text>
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
