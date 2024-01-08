import {
  Alert,
  AlertIcon, Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { DatePicker } from 'components/DatePicker';
import { DatePickerButton } from 'components/DatePicker/DatePickerButton';
import { BigNumber, ethers } from 'ethers';
import { useRewrapSarcophagus } from 'hooks/embalmerFacet';
import { useAllowance } from 'hooks/sarcoToken/useAllowance';
import { useApprove } from 'hooks/sarcoToken/useApprove';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { useGetSarcophagusDetails } from 'hooks/useGetSarcophagusDetails';
import { useGetSarcophagusArchaeologists } from 'hooks/viewStateFacet/useGetSarcophagusArchaeologists';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArchaeologistData, sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { useSelector } from 'store/index';
import { useSarcoQuote } from '../../embalm/stepContent/hooks/useSarcoQuote';
import { SwapInfo } from '../../../components/SwapUX/SwapInfo';

export function Rewrap() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { sarcophagus } = useGetSarcophagusDetails(id);

  const archaeologists = useGetSarcophagusArchaeologists(
    id || ethers.constants.HashZero,
    sarcophagus?.archaeologistAddresses ?? []
  );

  const [resurrectionTime, setResurrectionTime] = useState<Date | null>(null);

  const { allowance } = useAllowance();

  const { rewrap, isRewrapping, error } = useRewrapSarcophagus(
    id || ethers.constants.HashZero,
    resurrectionTime
  );
  const { balance } = useSarcoBalance();

  const { timestampMs } = useSelector(x => x.appState);

  const maxRewrapIntervalFromSarcophagusSec = sarcophagus?.maximumRewrapInterval?.toNumber() ?? 0;

  // The calculated max rewrap interval is
  // ( new resurrection time - previous resurrection time ) * (2_000_000 / cursed bond percentage)
  // Defaults to max possible number
  const maxRewrapIntervalCalculatedSec = sarcophagus
    ? (Number(sarcophagus.resurrectionTime) - Number(sarcophagus.previousRewrapTime)) *
      (2_000_000 / sarcophagus.cursedBondPercentage)
    : Number.MAX_SAFE_INTEGER;

  // The max rewrap interval is the lesser value of the max rewrap interval from the sarcophagus and
  // the calculated max rewrap interval
  const maxRewrapIntervalMs =
    (maxRewrapIntervalFromSarcophagusSec < maxRewrapIntervalCalculatedSec
      ? maxRewrapIntervalFromSarcophagusSec
      : maxRewrapIntervalCalculatedSec) * 1000;

  const [totalDiggingFees, setTotalDiggingFees] = useState(ethers.constants.Zero);
  const [protocolFee, setProtocolFee] = useState(ethers.constants.Zero);
  const [protocolFeeBasePercentage, setProtocolFeeBasePercentage] = useState(ethers.constants.Zero);

  const setResurrectionTimeAndCalculateFees = (date: Date | null) => {
    setResurrectionTime(date);

    if (!date) return;

    async function setTotalFees() {
      const archaeologistsProfiles: ArchaeologistData[] = archaeologists.map(a => ({
        profile: {
          accusals: BigNumber.from(0),
          archAddress: '',
          failures: BigNumber.from(0),
          freeBond: BigNumber.from(0),
          maximumRewrapInterval: BigNumber.from(0),
          maximumResurrectionTime: BigNumber.from(0),
          peerId: '',
          successes: BigNumber.from(0),
          curseFee: a.curseFee,
          minimumDiggingFeePerSecond: a.diggingFeePerSecond,
        },
        isOnline: false,
      }));
      const {
        totalDiggingFees: newTotalDiggingFees,
        protocolFee: newProtocolFee,
        protocolFeeBasePercentage: newProtocolFeeBasePercentage,
      } = await sarco.archaeologist.getTotalFeesInSarco(
        archaeologistsProfiles,
        date?.getTime() || 0,
        timestampMs
      );
      setTotalDiggingFees(newTotalDiggingFees);
      setProtocolFee(newProtocolFee);
      setProtocolFeeBasePercentage(newProtocolFeeBasePercentage);
    }
    setTotalFees();
  };

  function handleCustomDateChange(date: Date | null): void {
    // Ensure that selected date is in the future
    if (date && date.getTime() > timestampMs) {
      setResurrectionTimeAndCalculateFees(date);
    }
  }

  const maxResurrectionDate = new Date(timestampMs + Number(maxRewrapIntervalMs));
  const maxResurrectionDateMs = maxResurrectionDate.getTime();

  // TODO -- buffer is temporarily removed. Determine if we need a buffer.
  const totalFeesWithBuffer = totalDiggingFees.add(protocolFee);
  const sarcoDeficit = totalFeesWithBuffer.sub(BigNumber.from(balance));
  const { sarcoQuoteETHAmount, sarcoQuoteInterval, sarcoQuoteError } = useSarcoQuote(sarcoDeficit);

  const { approve, isApproving } = useApprove({
    amount: totalFeesWithBuffer,
    onApprove: () =>
      setResurrectionTime(!resurrectionTime ? null : new Date(resurrectionTime.getTime() - 1)),
  });
  const isApproveError = error?.includes('amount exceeds allowance');

  function handleSetToPreviousInterval() {
    if (sarcophagus) {
      const newResurrectionTimeSec = sarcophagus.resurrectionTime
        .mul(2)
        .sub(sarcophagus.previousRewrapTime);

      if (newResurrectionTimeSec.mul(1000).toNumber() > maxResurrectionDateMs) {
        setResurrectionTimeAndCalculateFees(new Date(maxResurrectionDateMs));
      } else {
        setResurrectionTimeAndCalculateFees(new Date(newResurrectionTimeSec.mul(1000).toNumber()));
      }
    }
  }

  const filterInvalidTime = (time: Date) => {
    const selectedDateMs = new Date(time).getTime();
    return maxResurrectionDateMs >= selectedDateMs && timestampMs < selectedDateMs;
  };

  const maxResurrectionString = buildResurrectionDateString(
    BigNumber.from(Math.trunc(maxResurrectionDateMs / 1000)),
    timestampMs
  );

  const currentResurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime,
    timestampMs,
    {
      hideDuration: true,
    }
  );

  const isRewrapButtonDisabled =
    !resurrectionTime ||
    !rewrap ||
    isRewrapping ||
    (balance && balance.lt(totalFeesWithBuffer));

  const needsApproval = allowance?.lte(totalFeesWithBuffer);

  return (
    <VStack
      align="left"
      spacing={10}
      pointerEvents={isRewrapping ? 'none' : 'all'}
      pb={'30px'}
    >
      <VStack
        align="left"
        spacing={0}
      >
        <Text>Rewrap</Text>
        <Text variant="secondary">
          Please set a new time when you want your Sarcophagus resurrected.
        </Text>
      </VStack>

      <Flex
        direction="column"
        border="1px solid "
        borderColor="grayBlue.700"
        p={6}
        align="left"
        maxW="600px"
      >
        <Grid
          h="100px"
          templateRows="repeat(3, 1fr)"
          templateColumns="repeat(2, 1fr)"
          gap={4}
        >
          <GridItem
            alignSelf="end"
            justifySelf="center"
          >
            <Text variant="secondary">New Resurrection</Text>
          </GridItem>
          <GridItem
            alignSelf="end"
            justifySelf="center"
          >
            <Text variant="secondary">Current Resurrection</Text>
          </GridItem>
          <GridItem
            alignSelf="center"
            justifySelf="center"
          >
            <DatePicker
              selected={resurrectionTime}
              onChange={handleCustomDateChange}
              showTimeSelect
              minDate={new Date(timestampMs)}
              maxDate={maxResurrectionDate}
              filterTime={filterInvalidTime}
              showPopperArrow={false}
              timeIntervals={30}
              timeCaption="Time"
              timeFormat="hh:mma"
              dateFormat="MM.dd.yyyy hh:mma"
              fixedHeight
              customInput={<DatePickerButton />}
            />
          </GridItem>
          <GridItem
            alignSelf="center"
            justifySelf="center"
          >
            <Text fontSize="md">{currentResurrectionString}</Text>
          </GridItem>
          <GridItem
            alignSelf="center"
            justifySelf="center"
          >
            <GridItem></GridItem>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSetToPreviousInterval}
            >
              <Text
                fontSize="xs"
                variant="secondary"
              >
                Use Previous Interval
              </Text>
            </Button>
          </GridItem>
        </Grid>
        <Text
          mt="64px"
          variant="secondary"
          textAlign="center"
        >
          Furthest allowed rewrap time: {maxResurrectionString}
        </Text>
      </Flex>

      <VStack
        align="left"
        spacing={1}
      >
        <Flex direction="row">
          <Text>Fees</Text>
          <Text
            ml={1}
            variant="secondary"
          >
            (estimated)
          </Text>
        </Flex>
        <HStack spacing={3}>
          <Text variant="secondary">
            Digging fee: {sarco.utils.formatSarco(totalDiggingFees.toString())} SARCO
          </Text>
        </HStack>
        <HStack spacing={3}>
          <Text variant="secondary">
            Protocol fee ({protocolFeeBasePercentage.div(100).toString()}%):{' '}
            {sarco.utils.formatSarco(protocolFee.toString())} SARCO
          </Text>
        </HStack>
      </VStack>
      {sarcoDeficit.gt(0) && (
        <Box width="500px" maxWidth="90%">
          <SwapInfo
            isRewrap={true}
            sarcoQuoteError={sarcoQuoteError}
            sarcoQuoteETHAmount={sarcoQuoteETHAmount}
            sarcoDeficit={sarcoDeficit}
            balance={balance}
            totalFeesWithBuffer={totalFeesWithBuffer} />
        </Box>
      )}
      <HStack>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Tooltip label={!resurrectionTime ? 'Please set a new resurrection time' : ''}>
          <div>
            <Button
              onClick={() => {
                if (needsApproval) {
                  approve?.();
                } else {
                  rewrap?.();
                }
              }}
              isDisabled={!isApproveError && isRewrapButtonDisabled}
              isLoading={isApproving || isRewrapping}
              loadingText={isApproving ? 'Approving' : 'Rewrapping...'}
            >
              {needsApproval ? 'Approve' : 'Rewrap'}
            </Button>
          </div>
        </Tooltip>
      </HStack>
    </VStack>
  );
}
