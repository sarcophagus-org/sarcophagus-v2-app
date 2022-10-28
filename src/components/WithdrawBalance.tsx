import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  HStack,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useState } from 'react';
import { useGetBalance } from '../features/embalm/stepContent/hooks/useGetBalance';

/**
 * This is a temporary component meant to be used as a showcase for the arweave bundlr functionality
 */
export function WithdrawBalance() {
  const { bundlr, withdraw, isWithdrawing } = useBundlr();
  const { balance } = useGetBalance();
  const [amount, setAmount] = useState('');

  function handleChangeAmount(valueAsString: string) {
    setAmount(valueAsString);
  }

  async function handleWithdrawAmount() {
    const parsedAmount = ethers.utils.parseUnits(amount);
    await withdraw(parsedAmount);
  }

  function handleClickMax() {
    setAmount(balance);
  }

  function isButtonDisabled() {
    return (
      amount.trim().length === 0 ||
      parseFloat(amount) === 0 ||
      parseFloat(amount) > parseFloat(balance) ||
      !bundlr ||
      isWithdrawing
    );
  }

  function isInputDisabled() {
    return !bundlr || isWithdrawing;
  }

  return (
    <Flex direction="column">
      <FormLabel mt={6}>Withdraw Amount</FormLabel>

      {/* <Flex align="center">
        <FormControl
          width="100%"
          alignItems="center"
        >
          <NumberInput
            mt={1}
            value={amount}
            onChange={handleChangeAmount}
            isDisabled={isInputDisabled()}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <Button
          ml={3}
          variant="link"
          onClick={handleClickMax}
        >
          Max
        </Button>
        <Button
          ml={3}
          w="150px"
          onClick={handleWithdrawAmount}
          disabled={isButtonDisabled()}
          isLoading={isWithdrawing}
        >
          Withdraw
        </Button>
      </Flex> */}

      {/* NEW FORM */}

      <HStack mb="8">
        <NumberInput
          flex={1}
          mr={3}
          value={amount}
          onChange={handleChangeAmount}
          isDisabled={isInputDisabled()}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button
          ml={3}
          variant="link"
          onClick={handleClickMax}
        >
          Max
        </Button>
        <Button
          float="right"
          w="150px"
          onClick={handleWithdrawAmount}
          disabled={isButtonDisabled()}
          isLoading={isWithdrawing}
        >
          Withdraw
        </Button>
      </HStack>
    </Flex>
  );
}
