import {
  Flex,
  NumberInput,
  NumberInputField,
  InputLeftElement,
  InputGroup,
  NumberInputProps,
} from '@chakra-ui/react';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';
import { SarcoTokenIcon } from 'components/icons';

interface DiggingFeesInputProps extends NumberInputProps {
  setDiggingFees: (value: string) => void;
  placeholder?: string;
}

export function DiggingFeesInput({
  setDiggingFees,
  placeholder = '',
  ...rest
}: DiggingFeesInputProps) {
  function handleChangeDiggingFees(valueAsString: string, valueAsNumber: number) {
    valueAsString = removeNonIntChars(valueAsString);
    valueAsString = removeLeadingZeroes(valueAsString);

    if (valueAsNumber < 0) {
      valueAsString = '0';
      valueAsNumber = 0;
    }

    if (valueAsString.length > 18) return;

    setDiggingFees(valueAsString);
  }

  return (
    <Flex align="center">
      <InputGroup>
        <NumberInput
          w="150px"
          onChange={handleChangeDiggingFees}
          {...rest}
        >
          <NumberInputField
            pl={12}
            pr={1}
            placeholder={placeholder}
            borderColor="violet.700"
          />
          <InputLeftElement>
            <SarcoTokenIcon boxSize="16px" />
          </InputLeftElement>
        </NumberInput>
      </InputGroup>
    </Flex>
  );
}
