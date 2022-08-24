import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useBundlr } from './hooks/useBundlr';
import { useGetBalance } from './hooks/useGetBalance';

export function WithdrawBalance() {
  const { bundlr, withdraw, isWithdrawing } = useBundlr();
  const balance = useGetBalance();
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

  function isInputError() {
    return parseFloat(amount) > parseFloat(balance);
  }

  return (
    <Flex
      mt={6}
      direction="column"
    >
      <Heading size="md">Withdraw Balance</Heading>
      <Flex
        align="center"
        mt={6}
      >
        <FormControl
          width={200}
          alignItems="center"
        >
          <NumberInput
            mt={1}
            value={amount}
            color={isInputError() ? 'error' : 'default'}
            onChange={handleChangeAmount}
            isDisabled={isInputDisabled()}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <Button
          ml={3}
          variant="link"
          colorScheme="blue"
          onClick={handleClickMax}
        >
          Max
        </Button>
        <Button
          ml={3}
          colorScheme="blue"
          onClick={handleWithdrawAmount}
          disabled={isButtonDisabled()}
          isLoading={isWithdrawing}
        >
          Withdraw
        </Button>
      </Flex>
    </Flex>
  );
}
