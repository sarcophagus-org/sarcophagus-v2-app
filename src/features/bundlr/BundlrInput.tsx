import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { uploadPriceDecimals } from 'lib/constants';
import { useEffect, useState } from 'react';

const inputLimit = 46;

interface BundlrInputProps {
  initialAmount?: BigNumber;
  inputHeight?: string;
  onInputChange: Function;
}

export const BundlrInput = ({
  initialAmount,
  inputHeight = '48px',
  onInputChange,
}: BundlrInputProps) => {
  const initialInputStr = `${
    initialAmount
      ? Number(ethers.utils.formatEther(initialAmount)).toFixed(uploadPriceDecimals)
      : ''
  }`;
  const [inputAmount, setInputAmount] = useState(initialInputStr);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    if (!initialised && !!initialInputStr) {
      onInputChange(ethers.utils.parseUnits(initialInputStr));
      setInitialised(true);
    }
  }, [initialised, initialInputStr, onInputChange]);

  const handleInputChange = (valueAsString: string) => {
    let isValidInput = false;

    if (!valueAsString) {
      setInputAmount('');
      onInputChange(undefined);
      return;
    }

    valueAsString = valueAsString.slice(0, inputLimit);
    const valueAsFloat = Number.parseFloat(valueAsString);

    isValidInput = !Number.isNaN(valueAsFloat) && valueAsFloat > 0;

    try {
      ethers.utils.parseEther(valueAsString);
    } catch (_) {
      isValidInput = false;
    }

    setInputAmount(valueAsString);
    onInputChange(isValidInput ? ethers.utils.parseUnits(valueAsString) : undefined);
  };

  return (
    <InputGroup flex={1}>
      <NumberInput
        step={0.01}
        w="100%"
        min={0}
        color="whiteAlpha.700"
        allowMouseWheel
        value={inputAmount}
        onChange={handleInputChange}
        focusInputOnChange={true}
      >
        <NumberInputField
          borderColor="whiteAlpha.700"
          color="whiteAlpha.800"
          h={inputHeight}
        />
        <InputRightElement
          height={inputHeight}
          color="white"
          mr="30px"
          fontWeight={700}
        >
          ETH
        </InputRightElement>

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
    </InputGroup>
  );
};
