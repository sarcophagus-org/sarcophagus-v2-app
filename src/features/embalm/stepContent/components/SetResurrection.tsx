import { Button, Flex, FlexProps, forwardRef, HStack, Text, VStack } from '@chakra-ui/react';
import { DatePicker } from 'components/DatePicker';
import { Radio } from 'components/Radio';
import { useSelector } from 'store/index';
import { useSetResurrection } from '../hooks/useSetResurrection';

export enum ResurrectionRadioValue {
  ThirtyDays = '30 days',
  SixtyDays = '60 days',
  NinetyDays = '90 days',
}

export function SetResurrection({ ...rest }: FlexProps) {
  const options = Object.values(ResurrectionRadioValue);
  const { timestampMs } = useSelector(x => x.appState);

  const {
    error,
    getRadioProps,
    radioValue,
    customResurrectionDate,
    handleCustomDateChange,
    handleCustomDateClick,
  } = useSetResurrection();

  const CustomResurrectionButton = forwardRef(({ value, onClick }, ref) => (
    <Flex>
      <Button
        onClick={onClick}
        ref={ref}
        variant={radioValue !== 'Other' ? 'disabledLook' : 'solid'}
      >
        {/* this value is an empty string, so this logic evalutate true on null | undefinded | '' */}
        {value ? value : 'Select Custom Date'}
      </Button>
    </Flex>
  ));

  return (
    <Flex
      direction="column"
      {...rest}
    >
      <VStack
        align="left"
        spacing="5"
        border="1px solid "
        borderColor="grayBlue.700"
        px={9}
        py={6}
      >
        <HStack spacing={6}>
          <Radio {...getRadioProps({ value: options[0] })}>
            <Text textAlign="center">{options[0]}</Text>
          </Radio>
          <Radio {...getRadioProps({ value: options[1] })}>
            <Text textAlign="center">{options[1]}</Text>
          </Radio>
          <Radio {...getRadioProps({ value: options[2] })}>
            <Text textAlign="center">{options[2]}</Text>
          </Radio>
        </HStack>
        <HStack spacing={6}>
          <Radio {...getRadioProps({ value: 'Other' })}>
            <DatePicker
              selected={customResurrectionDate}
              onChange={handleCustomDateChange}
              onInputClick={handleCustomDateClick}
              showTimeSelect
              minDate={new Date(timestampMs)}
              showPopperArrow={false}
              timeIntervals={30}
              timeCaption="Time"
              timeFormat="hh:mma"
              dateFormat="MM.dd.yyyy hh:mma"
              fixedHeight
              filterTime={date => timestampMs < date.getTime()}
              customInput={<CustomResurrectionButton />}
            />
          </Radio>
        </HStack>
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
