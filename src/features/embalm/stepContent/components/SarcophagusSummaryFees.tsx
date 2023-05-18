import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, Text, Tooltip } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { formatFee } from 'lib/utils/helpers';
import { useSelector } from 'store/index';
import { SummaryErrorIcon } from './SummaryErrorIcon';
import { formatSarco, sarco } from 'sarcophagus-v2-sdk';
import { useEffect, useState } from 'react';

export function SarcophagusSummaryFees() {
  const { uploadPrice, selectedArchaeologists, resurrection } = useSelector(x => x.embalmState);
  const { balance } = useSarcoBalance();
  const { timestampMs } = useSelector(x => x.appState);

  const [totalFees, setTotalFees] = useState(ethers.constants.Zero);
  const [totalDiggingFees, setTotalDiggingFees] = useState(ethers.constants.Zero);
  const [formattedTotalDiggingFees, setFormattedTotalDiggingFees] = useState('');
  const [protocolFee, setProtocolFee] = useState(ethers.constants.Zero);
  const [totalCurseFees, setTotalCurseFees] = useState(ethers.constants.Zero);
  const [protocolFeeBasePercentage, setProtocolFeeBasePercentage] = useState('--');

  useEffect(() => {
    sarco.archaeologist
      .getTotalFeesInSarco(selectedArchaeologists, resurrection, timestampMs)
      .then(
        ({
          totalDiggingFees: diggingFees,
          protocolFee: protocolFeeVal,
          formattedTotalDiggingFees: formattedDiggingFees,
          protocolFeeBasePercentage: baseFeePercent,
        }) => {
          setTotalDiggingFees(diggingFees);
          setProtocolFee(protocolFeeVal);
          setProtocolFeeBasePercentage(baseFeePercent.toString());
          setFormattedTotalDiggingFees(formattedDiggingFees);

          const totalCurseFeesCalc = selectedArchaeologists.reduce(
            (acc, archaeologist) => acc.add(archaeologist.profile.curseFee),
            BigNumber.from(0)
          );

          setTotalCurseFees(totalCurseFeesCalc);
          const diggingFeesAndCurseFees = diggingFees.add(totalCurseFeesCalc);

          setTotalFees(diggingFeesAndCurseFees.add(protocolFeeVal));
        }
      );
  }, [resurrection, selectedArchaeologists, timestampMs]);

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
              + {protocolFeeBasePercentage}% protocol fee
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
