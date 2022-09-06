import { Divider, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Radio } from 'components/Radio';
import { PeriodPicker } from '../components/PeriodPicker';
import { useResurrections } from '../hooks/useResurrections';

export enum ResurrectionRadioValue {
  OneWeek = '1 week',
  OneMonth = '1 month',
  ThreeMonths = '3 months',
}

export function Resurrections() {
  const options = Object.values(ResurrectionRadioValue);

  const {
    error,
    getRadioProps,
    getRootProps,
    handleBlurDate,
    handleFocusDate,
    handleOtherDateChange,
    otherValue,
    radioValue,
  } = useResurrections();

  const group = getRootProps();

  return (
    <Flex direction="column">
      <Heading>Resurrections</Heading>
      <Text mt={3}>
        The sarcophagus will be resurrected on the resurrection date unless the embalmer rewraps it.
      </Text>
      <Divider mt={6} />
      <Heading
        size="sm"
        mt={9}
      >
        Resurrection Cadence
      </Heading>
      <Text mt={4}>What do you want your maximum rewrap interval to be?</Text>
      <VStack
        {...group}
        align="left"
        spacing={6}
        px={9}
        py={6}
        border="1px solid"
        borderColor="violet.700"
        mt={6}
        direction="column"
      >
        <Radio {...getRadioProps({ value: options[0] })}>{options[0]}</Radio>
        <Radio {...getRadioProps({ value: options[1] })}>{options[1]}</Radio>
        <Radio {...getRadioProps({ value: options[2] })}>{options[2]}</Radio>
        <Radio {...getRadioProps({ value: 'Other' })}>
          Other
          <PeriodPicker
            value={otherValue}
            onChange={handleOtherDateChange}
            onFocus={handleFocusDate}
            onBlur={handleBlurDate}
            disabled={radioValue !== 'Other'}
          />
        </Radio>
      </VStack>
      {error && (
        <Text
          mt={3}
          textAlign="center"
          color="error"
        >
          {error}
        </Text>
      )}
    </Flex>
  );
}
