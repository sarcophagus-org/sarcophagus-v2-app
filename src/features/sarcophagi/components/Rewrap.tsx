import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { DatePicker } from 'components/DatePicker';
import { DatePickerButton } from 'components/DatePicker/DatePickerButton';
import { BigNumber, ethers } from 'ethers';
import { useRewrapSarcophagus } from 'hooks/embalmerFacet';
import { useGetSarcophagusDetails } from 'hooks/viewStateFacet';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function Rewrap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sarcophagus } = useGetSarcophagusDetails({ sarcoId: id });
  const [resurrectionTime, setResurrectionTime] = useState<Date | null>(null);
  const { rewrap, isLoading, isRewrapping, isSuccess } = useRewrapSarcophagus(
    id || ethers.constants.HashZero,
    resurrectionTime
  );

  function handleCustomDateChange(date: Date | null) {
    setResurrectionTime(date);
  }

  const maximumResurectionDate =
    sarcophagus && sarcophagus.resurrectionTime
      ? new Date(sarcophagus.resurrectionTime.toNumber() * 1000)
      : undefined;

  const filterInvalidTime = (time: Date) => {
    const resurectionDate = new Date(maximumResurectionDate || 0).getTime();
    const selectedDate = new Date(time).getTime();

    return resurectionDate >= selectedDate && Date.now() < selectedDate;
  };

  const resurrectionString = buildResurrectionDateString(
    sarcophagus?.resurrectionTime || BigNumber.from(0)
  );

  const diggingFee = 25; //TODO: need to calculate digging fee
  const protocalFee = diggingFee * 0.1;

  return (
    <VStack
      align="left"
      spacing={8}
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
        borderColor="violet.700"
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
        spacing={0}
      >
        <Text>Fees</Text>
        <Text variant="secondary">Digging fee: {diggingFee}</Text>
        <Text variant="secondary">Protocol fee: {protocalFee}</Text>
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
