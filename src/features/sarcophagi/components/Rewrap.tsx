import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { DatePicker } from 'components/DatePicker';
import { DatePickerButton } from 'components/DatePicker/DatePickerButton';
import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useRewrapSarcophagus } from 'hooks/embalmerFacet';
import { useGetProtocolFeeAmount, useGetSarcophagus } from 'hooks/viewStateFacet';
import { useGetSarcophagusArchaeologists } from 'hooks/viewStateFacet/useGetSarcophagusArchaeologists';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const { rewrap, isLoading, isRewrapping, isSuccess } = useRewrapSarcophagus(
    id || ethers.constants.HashZero,
    resurrectionTime
  );

  const nowMs = Date.now();

  const rewrapIntervalSeconds = sarcophagus?.maximumRewrapInterval?.toNumber() ?? 0;
  const rewrapIntervalMs = rewrapIntervalSeconds * 1000;

  function handleCustomDateChange(date: Date | null) {
    setResurrectionTime(date);
  }

  const maximumResurectionDate = new Date(nowMs + rewrapIntervalMs);
  const resurectionDateMs = maximumResurectionDate.getTime();

  const filterInvalidTime = (time: Date) => {
    const selectedDateMs = new Date(time).getTime();
    return resurectionDateMs >= selectedDateMs && nowMs < selectedDateMs;
  };

  const resurrectionString = buildResurrectionDateString(
    BigNumber.from(Math.trunc(resurectionDateMs / 1000))
  );

  // Sum up the digging fees from the archaeologists objects
  const totalDiggingFeeBn = useMemo(() => {
    return archaeologists?.reduce((acc, archaeologist) => {
      return acc.add(archaeologist.diggingFee);
    }, BigNumber.from(0));
  }, [archaeologists]);
  const protocolFeeBn = totalDiggingFeeBn.mul(protocolFeeAmountInt).div(100);

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

      <VStack
        border="1px solid "
        borderColor="grayBlue.700"
        p={6}
        align="left"
        maxW="640px"
      >
        <DatePicker
          selected={resurrectionTime}
          onChange={handleCustomDateChange}
          showTimeSelect
          minDate={new Date()}
          maxDate={maximumResurectionDate}
          filterTime={filterInvalidTime}
          showPopperArrow={false}
          timeIntervals={30}
          timeCaption="Time"
          timeFormat="hh:mma"
          dateFormat="MM.dd.yyyy hh:mma"
          fixedHeight
          customInput={<DatePickerButton />}
        />
        <Text variant="secondary">Furthest allowed rewrap time: {resurrectionString}</Text>
      </VStack>

      <VStack
        align="left"
        spacing={1}
      >
        <Text>Fees</Text>
        <HStack spacing={3}>
          <Text variant="secondary">Digging fee : {formatEther(totalDiggingFeeBn)} SARCO</Text>
        </HStack>
        <HStack spacing={3}>
          <Text variant="secondary">
            Protocol fee ({protocolFeeAmountInt}%) : {formatEther(protocolFeeBn)} SARCO
          </Text>
        </HStack>
      </VStack>
      <HStack>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          onClick={() => rewrap?.()}
          isDisabled={!!!resurrectionTime || !rewrap}
          isLoading={isLoading}
        >
          {isRewrapping ? 'Rewrapping...' : 'Rewrap'}
        </Button>
      </HStack>
    </VStack>
  );
}
