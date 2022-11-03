import {
  Button,
  Flex,
  InputGroup,
  Input,
  FormLabel,
  InputRightElement,
  HStack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useState, useCallback } from 'react';
import { useGetBalance } from '../features/embalm/stepContent/hooks/useGetBalance';
import { useDispatch } from 'store/index';
import { setBalance } from 'store/bundlr/actions';

export function WithdrawBalance() {
  const dispatch = useDispatch();
  const { getBalance } = useGetBalance();
  const { bundlr, withdraw, isWithdrawing } = useBundlr();
  const { balance } = useGetBalance();
  const [amount, setAmount] = useState('');

  // function handleChangeAmount(valueAsString: string) {
  //   setAmount(valueAsString);
  // }

  const isAmountValid = parseFloat(amount) > 0;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (Number(value) < 0 || !ethers.utils.parseEther(value)) return;
    const inputLimit = 46;
    setAmount(value.slice(0, inputLimit));
  }

  // async function handleWithdrawAmount() {
  //   if (!isAmountValid) return;
  //   // const parsedAmount = ethers.utils.parseUnits(amount);
  //   // await withdraw(parsedAmount);
  //   await withdraw(amount);
  // }

  const handleWithdrawAmount = useCallback(async () => {
    if (!isAmountValid) return;
    await withdraw(amount);
    const newBalance = await getBalance();
    dispatch(setBalance(newBalance));
  }, [amount, dispatch, withdraw, getBalance, isAmountValid]);

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

  // function isInputDisabled() {
  //   return !bundlr || isWithdrawing;
  // }

  return (
    <Flex direction="column">
      <FormLabel mt={4}>Withdraw Amount</FormLabel>

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

      {/* <HStack mb="8">
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
      </HStack> */}

      <HStack mb="8">
        <InputGroup
          flex={1}
          mr={1}
        >
          <Input
            onChange={handleInputChange}
            value={amount}
            // readOnly={true}
            type="text"
            placeholder="0.00000000"
            _placeholder={{ color: 'inherit' }}
          />
          <InputRightElement fontWeight={700}>ETH</InputRightElement>
        </InputGroup>
        <Button
          variant="link"
          onClick={handleClickMax}
        >
          Max
        </Button>
        <Button
          float="right"
          w="150px"
          disabled={isButtonDisabled()}
          isLoading={isWithdrawing}
          onClick={handleWithdrawAmount}
        >
          Withdraw
        </Button>
      </HStack>
    </Flex>
  );
}
