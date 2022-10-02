import { Divider, Flex, Heading, Text, VStack, HStack, Button, FlexProps } from '@chakra-ui/react';
import { Radio } from 'components/Radio';
import { useResurrections } from '../hooks/useResurrections';

export enum ResurrectionRadioValue {
  OneWeek = '1 month',
  OneMonth = '2 months',
  ThreeMonths = '3 months',
}

export function Resurrections({ ...rest }: FlexProps) {
  const options = Object.values(ResurrectionRadioValue);

  const {
    error,
    getRadioProps,
    getRootProps,
    // handleBlurDate,
    // handleFocusDate,
    // handleOtherDateChange,
    // otherValue,
    radioValue,
  } = useResurrections();

  const group = getRootProps();

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
        When do you want Sarcophagus resurrected? You can change this later.
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
        <Radio {...getRadioProps({ value: 'Other' })}>
          <Button>Custom Date</Button>
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
