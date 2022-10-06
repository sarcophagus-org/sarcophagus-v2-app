import {
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  FlexProps,
  forwardRef,
} from '@chakra-ui/react';
import { Radio } from 'components/Radio';
import { useResurrection } from '../hooks/useResurrection';
import { DatePicker } from 'components/DatePicker';

export enum ResurrectionRadioValue {
  OneMonth = '1 month',
  TwoMonth = '2 months',
  ThreeMonths = '3 months',
}

export function Resurrection({ ...rest }: FlexProps) {
  const options = Object.values(ResurrectionRadioValue);

  const { error, getRadioProps, radioValue, customResurrectionDate, handleCustomDateChange } =
    useResurrection();

  const CustomResurrectionButton = forwardRef(({ value, onClick, disabled }, ref) => (
    <Button
      onClick={onClick}
      ref={ref}
      disabled={disabled}
    >
      {value ? value : 'Custom Date'}
    </Button>
  ));

  return (
    <Flex
      direction="column"
      {...rest}
    >
      <Heading size="sm">Resurrection</Heading>
      <Text
        variant="secondary"
        mt={4}
      >
        When do you want your Sarcophagus resurrected? You can change this later.
      </Text>
      <VStack
        align="left"
        spacing="5"
        border="1px solid "
        borderColor="violet.700"
        px={9}
        py={6}
        mt={6}
      >
        <HStack spacing={6}>
          <Radio {...getRadioProps({ value: options[0] })}>{options[0]}</Radio>
          <Radio {...getRadioProps({ value: options[1] })}>{options[1]}</Radio>
          <Radio {...getRadioProps({ value: options[2] })}>{options[2]}</Radio>
        </HStack>
        <HStack spacing={6}>
          <Radio {...getRadioProps({ value: 'Other' })}>
            <DatePicker
              selected={customResurrectionDate}
              onChange={handleCustomDateChange}
              showTimeSelect
              minDate={new Date()}
              showPopperArrow={false}
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="MM/dd/yyyy HH:mm"
              fixedHeight
              disabled={radioValue !== 'Other'}
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
