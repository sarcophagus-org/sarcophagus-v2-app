import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputProps,
} from '@chakra-ui/react';

export function BundlrInput(props: NumberInputProps) {
  return (
    <NumberInput
      mt={3}
      w="100%"
      min={0}
      color="whiteAlpha.700"
      {...props}
    >
      <NumberInputField
        borderColor="whiteAlpha.700"
        color="whiteAlpha.800"
        h="48px"
      />
      <NumberInputStepper>
        <NumberIncrementStepper
          color="whiteAlpha.700"
          borderColor="whiteAlpha.700"
        />
        <NumberDecrementStepper
          color="whiteAlpha.700"
          borderColor="whiteAlpha.700"
        />
      </NumberInputStepper>
    </NumberInput>
  );
}
