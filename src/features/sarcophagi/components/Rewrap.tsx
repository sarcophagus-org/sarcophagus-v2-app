import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { DatePicker } from 'components/DatePicker';
import { DatePickerButton } from 'components/DatePicker/DatePickerButton';
import { BigNumber, ethers } from 'ethers';
import { useRewrapSarcophagus } from 'hooks/embalmerFacet';
import { useSarcoBalance } from 'hooks/sarcoToken/useSarcoBalance';
import { useGetProtocolFeeAmount, useGetSarcophagus } from 'hooks/viewStateFacet';
import { useGetSarcophagusArchaeologists } from 'hooks/viewStateFacet/useGetSarcophagusArchaeologists';
import { buildResurrectionDateString, formatSarco, getTotalFeesInSarco } from 'lib/utils/helpers';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'store/index';

export function Rewrap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sarcophagus } = useGetSarcophagus(id);
  const archaeologists = useGetSarcophagusArchaeologists(
    id || ethers.constants.HashZero,
    sarcophagus?.archaeologistAddresses ?? []
  );
  const protocolFeeAmountInt = useGetProtocolFeeAmount();
  const [resurrectionTime, setResurrectionTime] = useState<Date | null>(null);
  const { rewrap, isRewrapping, isSuccess, mayFail, isError } = useRewrapSarcophagus(
    id || ethers.constants.HashZero,
    resurrectionTime
  );
  const { balance } = useSarcoBalance();

  const { timestampMs } = useSelector(x => x.appState);

  const maxRewrapIntervalFromSarcophagusSec = sarcophagus?.maximumRewrapInterval?.toNumber() ?? 0;

  // The calculated max rewrap interval is
  // ( new resurrection time - previous resurrection time ) * (200 / cursed bond percentage)
  // Defaults to max possible number
  const maxRewrapIntervalCalculatedSec = sarcophagus
    ? (Number(sarcophagus.resurrectionTime) - Number(sarcophagus.previousRewrapTime)) *
      (200 / sarcophagus.cursedBondPercentage)
    : Number.MAX_SAFE_INTEGER;

  // The max rewrap interval is the lesser value of the max rewrap interval from the sarcophagus and
  // the calculated max rewrap interval
  const maxRewrapIntervalMs =
    (maxRewrapIntervalFromSarcophagusSec < maxRewrapIntervalCalculatedSec
      ? maxRewrapIntervalFromSarcophagusSec
      : maxRewrapIntervalCalculatedSec) * 1000;

  function handleCustomDateChange(date: Date | null): void {
    // Ensure that selected date is in the future
    if (date && date.getTime() > timestampMs) {
      setResurrectionTime(date);
    }
  }

  function handleSetToPreviousInterval() {
    if (sarcophagus) {
      const newResurrectionTimeSec = sarcophagus.resurrectionTime
        .mul(2)
        .sub(sarcophagus.previousRewrapTime);

      setResurrectionTime(new Date(newResurrectionTimeSec.mul(1000).toNumber()));
    }
  }

  const maxResurrectionDate = new Date(timestampMs + Number(maxRewrapIntervalMs));
  const maxResurrectionDateMs = maxResurrectionDate.getTime();

  const filterInvalidTime = (time: Date) => {
    const selectedDateMs = new Date(time).getTime();
    return maxResurrectionDateMs >= selectedDateMs && timestampMs < selectedDateMs;
  };

  const newResurrectionString = buildResurrectionDateString(
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

  const { totalDiggingFees, protocolFee } = getTotalFeesInSarco(
    resurrectionTime?.getTime() || 0,
    archaeologists.map(a => BigNumber.from(a.diggingFeePerSecond)),
    timestampMs,
    protocolFeeAmountInt
  );

  const diggingPlusProtocolFees = totalDiggingFees.add(protocolFee);

  const isRewrapButtonDisabled =
    !resurrectionTime ||
    !rewrap ||
    isRewrapping ||
    isError ||
    mayFail ||
    (balance && balance.lt(diggingPlusProtocolFees));

  return (
    <VStack
      align="left"
      spacing={10}
      pointerEvents={isRewrapping || isSuccess ? 'none' : 'all'}
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
          Furthest allowed rewrap time: {newResurrectionString}
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
            Digging fee: {formatSarco(totalDiggingFees.toString())} SARCO
          </Text>
        </HStack>
        <HStack spacing={3}>
          <Text variant="secondary">
            Protocol fee ({protocolFeeAmountInt}%): {formatSarco(protocolFee.toString())} SARCO
          </Text>
        </HStack>
      </VStack>
      {balance && balance.lt(diggingPlusProtocolFees) ? (
        <Alert status="error">
          <AlertIcon color="red" />
          <Text>Insufficient SARCO balance</Text>
        </Alert>
      ) : (
        <></>
      )}
      <HStack>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          onClick={() => rewrap?.()}
          isDisabled={isRewrapButtonDisabled}
          isLoading={isRewrapping}
          loadingText="Rewrapping..."
        >
          Rewrap
        </Button>
      </HStack>
    </VStack>
  );
}
