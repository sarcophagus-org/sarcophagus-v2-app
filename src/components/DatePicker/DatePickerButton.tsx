import { Button, ButtonProps, Flex } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const DatePickerButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ value, onClick }, ref) => (
    <Flex>
      <Button
        onClick={onClick}
        ref={ref}
        variant="solid"
      >
        {/* this value is an empty string, so this logic evalutate true on null | undefinded | '' */}
        {value ? value : 'Select Custom Date'}
      </Button>
    </Flex>
  )
);

DatePickerButton.displayName = 'DatePickerButton';
