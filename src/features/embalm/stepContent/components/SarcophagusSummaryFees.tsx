import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, Text, Tooltip } from '@chakra-ui/react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { BigNumber, ethers } from 'ethers';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { useEffect, useState } from 'react';
import { useSelector } from 'store/index';
import { SummaryErrorIcon } from './SummaryErrorIcon';

export function SarcophagusSummaryFees() {
  const { selectedArchaeologists, resurrection } = useSelector(x => x.embalmState);
  const { balance } = useSarcoBalance();
  const { timestampMs } = useSelector(x => x.appState);

  const [totalFees, setTotalFees] = useState(ethers.constants.Zero);
  const [totalDiggingFees, setTotalDiggingFees] = useState(ethers.constants.Zero);
  const [formattedTotalDiggingFees, setFormattedTotalDiggingFees] = useState('');
  const [protocolFee, setProtocolFee] = useState(ethers.constants.Zero);
  const [totalCurseFees, setTotalCurseFees] = useState(ethers.constants.Zero);
  const [protocolFeeBasePercentage, setProtocolFeeBasePercentage] = useState('--');

  useEffect(() => {
    async function setFees() {
      // Get the fees
      const {
        totalDiggingFees: newTotalDiggingFees,
        protocolFee: newProtocolFee,
        formattedTotalDiggingFees: newFormattedTotalDiggingFees,
        protocolFeeBasePercentage: newProtocolFeeBasePercentage,
      } = await sarco.archaeologist.getTotalFeesInSarco(
        selectedArchaeologists,
        resurrection,
        timestampMs
      );

      // Set the fees in state
      setTotalDiggingFees(newTotalDiggingFees);
      setFormattedTotalDiggingFees(newFormattedTotalDiggingFees);
      setProtocolFeeBasePercentage(newProtocolFeeBasePercentage.toString());

      // Calculate and set total curse fees
      const totalCurseFeesCalc = selectedArchaeologists.reduce(
        (acc, archaeologist) => acc.add(archaeologist.profile.curseFee),
        BigNumber.from(0)
      );
      setTotalCurseFees(totalCurseFeesCalc);

      // TODO -- protocol fees with curse fees should happen in the SDK
      let totalProtocolFees;
      if (newProtocolFee && protocolFeeBasePercentage) {
        totalProtocolFees = newProtocolFee.add(
          totalCurseFeesCalc.div(
            BigNumber.from(10000).div(BigNumber.from(protocolFeeBasePercentage))
          )
        );
      } else {
        totalProtocolFees = BigNumber.from(0);
      }

      setProtocolFee(totalProtocolFees);

      // Calculate and set digging and curse fees
      const diggingFeesAndCurseFees = newTotalDiggingFees.add(totalCurseFeesCalc);
      setTotalFees(diggingFeesAndCurseFees.add(totalProtocolFees));
    }

    setFees();
  }, [resurrection, selectedArchaeologists, timestampMs, protocolFeeBasePercentage]);

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
              label="This is how much SARCO it will cost in total to create your Sarcophagus. (NOTE: This includes a one time upload fee)"
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
          >
            <Text as="i">Total Fees</Text>
            <Text as="i">{sarco.utils.formatSarco(totalFees.toString())} SARCO</Text>
          </Flex>
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
              {sarco.utils.formatSarco(totalFees.toString(), 8)} SARCO
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
