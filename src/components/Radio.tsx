import { Box, Flex, RadioProps, useRadio } from '@chakra-ui/react';
import { RadioButton } from './RadioButton';

export function Radio(props: RadioProps) {
  const { children } = props;
  const { state, getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box
      as="label"
      cursor="pointer"
    >
      <input {...input} />
      <Flex
        {...checkbox}
        align="center"
      >
        <RadioButton checked={state.isChecked} />
        <Flex
          ml={3}
          align="center"
        >
          {children}
        </Flex>
      </Flex>
    </Box>
  );
}
