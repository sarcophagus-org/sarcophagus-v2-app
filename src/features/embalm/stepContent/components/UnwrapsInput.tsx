import {
  Flex,
  NumberInput,
  NumberInputField,
  InputGroup,
  NumberInputProps,
} from '@chakra-ui/react';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';

interface UnwrapsInputProps extends NumberInputProps {
  setUnwraps: (value: string) => void;
  placeholder?: string;
}

export function UnwrapsInput({ setUnwraps, placeholder = '', ...rest }: UnwrapsInputProps) {
  function handleChangeUnwraps(valueAsString: string, valueAsNumber: number) {
    valueAsString = removeNonIntChars(valueAsString);
    valueAsString = removeLeadingZeroes(valueAsString);

    if (valueAsNumber < 0) {
      valueAsString = '0';
      valueAsNumber = 0;
    }

    setUnwraps(valueAsString);
  }

  return (
    <Flex align="center">
      <InputGroup>
        <NumberInput
          w="150px"
          onChange={handleChangeUnwraps}
          {...rest}
        >
          <NumberInputField
            pl={12}
            pr={1}
            placeholder={placeholder}
            borderColor="violet.700"
          />
        </NumberInput>
      </InputGroup>
    </Flex>
  );
}
