import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';

interface PeriodInputProps {
  value: string;
  disabled: boolean;
  onChange: (valueAsString: string, valueAsNumber: number) => void;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
}

export function PeriodInput({ value, disabled, onChange, onFocus, onBlur }: PeriodInputProps) {
  return (
    <NumberInput
      allowMouseWheel
      isDisabled={disabled}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      precision={0}
      size="sm"
      value={value}
      w="100px"
    >
      <NumberInputField pl={4} />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}
