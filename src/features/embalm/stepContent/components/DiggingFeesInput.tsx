import {
  Flex,
  Image,
  NumberInput,
  NumberInputField,
  InputLeftElement,
  InputGroup,
  NumberInputProps,
} from '@chakra-ui/react';
import { ethers, BigNumber } from 'ethers';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';

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

    // if (valueAsString.length > 18) return;

    // const convertBN = valueAsString ? ethers.utils.parseEther(valueAsString) : '0';

    // const convertBN = Number(ethers.utils.parseEther(valueAsString)).toString();

    // const convertBN: BigNumber = ethers.utils.parseEther(valueAsString);
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
            <Image src="sarco-token-icon.png" />
          </InputLeftElement>
        </NumberInput>
      </InputGroup>
    </Flex>
  );
}
