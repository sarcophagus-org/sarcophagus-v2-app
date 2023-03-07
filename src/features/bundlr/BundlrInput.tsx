import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { uploadPriceDecimals } from 'lib/constants';
import { useState } from 'react';

const inputLimit = 46;

export function useBundlrInput(args: { initialAmount?: number; inputHeight?: string } = {}) {
  const { initialAmount, inputHeight: heightArg } = args;

  const [inputAmount, setInputAmount] = useState(
    `${initialAmount?.toFixed(uploadPriceDecimals) ?? ''}`
  );
  const [isValidInput, setIsValidInput] = useState(false);

  const handleInputChange = (valueAsString: string) => {
    setIsValidInput(false);

    if (!valueAsString) {
      setInputAmount('');
      return;
    }

    valueAsString = valueAsString.slice(0, inputLimit);
    const valueAsFloat = Number.parseFloat(valueAsString);

    setIsValidInput(!Number.isNaN(valueAsFloat) && valueAsFloat > 0);

    try {
      ethers.utils.parseEther(valueAsString);
    } catch (_) {
      setIsValidInput(false);
    }

    setInputAmount(valueAsString);
  };

  const inputHeight = heightArg ?? '48px';

  const BundlrInput = (
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

  return {
    BundlrInput,
    inputAmountBN: isValidInput ? ethers.utils.parseUnits(inputAmount) : undefined,
  };
}
