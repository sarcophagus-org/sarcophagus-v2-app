import { HStack } from '@chakra-ui/react';
import { PeriodInput } from './PeriodInput';

export interface Period {
  days: string;
  hours: string;
  minutes: string;
}

interface PeriodPickerProps {
  value: Period;
  disabled: boolean;
  onChange: (value: Period) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>, period: 'days' | 'hours' | 'minutes') => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>, period: 'days' | 'hours' | 'minutes') => void;
}

export function PeriodPicker({ value, disabled, onChange, onFocus, onBlur }: PeriodPickerProps) {
  function handleChange(period: 'days' | 'hours' | 'minutes', valueAsString: string) {
    const newValue = Object.assign({}, value);
    newValue[period] = valueAsString;

    onChange(newValue);
  }

  return (
    <HStack ml={6}>
      <PeriodInput
        value={value.days}
        onChange={valueAsString => {
          handleChange('days', valueAsString);
        }}
        onFocus={e => {
          onFocus(e, 'days');
        }}
        onBlur={e => {
          onBlur(e, 'days');
        }}
        disabled={disabled}
      />
      <PeriodInput
        value={value.hours}
        onChange={valueAsString => {
          handleChange('hours', valueAsString);
        }}
        onFocus={e => {
          onFocus(e, 'hours');
        }}
        onBlur={e => {
          onBlur(e, 'hours');
        }}
        disabled={disabled}
      />
      <PeriodInput
        value={value.minutes}
        onChange={valueAsString => {
          handleChange('minutes', valueAsString);
        }}
        onFocus={e => {
          onFocus(e, 'minutes');
        }}
        onBlur={e => {
          onBlur(e, 'minutes');
        }}
        disabled={disabled}
      />
    </HStack>
  );
}
