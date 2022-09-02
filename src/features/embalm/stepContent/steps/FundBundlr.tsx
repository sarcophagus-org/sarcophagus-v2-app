import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Alert } from 'components/Alert';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { useCallback, useState } from 'react';
import { setBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { useBundlrSession } from '../hooks/useBundlrSession';
import { useGetBalance } from '../hooks/useGetBalance';

export function FundBundlr() {
  const dispatch = useDispatch();
  const { fund, isFunding } = useBundlr();
  const { chain } = useNetwork();
  const { connectToBundlr, isConnected, disconnectFromBundlr } = useBundlrSession();
  const { balance, getBalance, formattedBalance } = useGetBalance();
  const { uploadPrice, formattedUploadPrice } = useUploadPrice();
  const file = useSelector(x => x.embalmState.file);
  const [amount, setAmount] = useState('');

  const isAmountValid = parseFloat(amount) > 0;

  function handleAmountChange(valueAsString: string, valueAsNumber: number) {
    if (valueAsNumber < 0) return;
    setAmount(valueAsString);
  }

  function handleDisconnect() {
    disconnectFromBundlr();
  }

  const handleFund = useCallback(async () => {
    if (!isAmountValid) return;
    await fund(amount);
    const newBalance = await getBalance();
    dispatch(setBalance(newBalance));
  }, [amount, dispatch, fund, getBalance, isAmountValid]);

  return (
    <VStack
      spacing={9}
      align="left"
      w="100%"
    >
      <Heading>Fund Arweave Bundlr</Heading>
      {!isConnected ? (
        <VStack
          pt={12}
          pb={12}
          spacing={9}
        >
          <Text>Your are not connected to the Arweave Bundlr</Text>
          <Button onClick={connectToBundlr}>Connect to Arweave Bundlr</Button>
        </VStack>
      ) : (
        <>
          <VStack align="left">
            <Flex>
              <Text variant="secondary">You are connected to the Arweave Bundlr.</Text>
              <Button
                ml={6}
                variant="link"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </Flex>
            <Text variant="secondary">Your Bundlr balance is {formattedBalance}.</Text>
            {file ? (
              <Text variant="secondary">
                {"The Bundlr's upload price is"} {formattedUploadPrice}.
              </Text>
            ) : (
              <Text variant="secondary">Upload a payload to get the upload price.</Text>
            )}
            {parseFloat(balance) < parseFloat(uploadPrice) && (
              <Text variant="secondary">You need to fund the Bundlr to continue.</Text>
            )}
          </VStack>
          <FormControl>
            {/* TODO: Remove this alert for production */}
            {chain?.id === 1 && (
              <Alert
                mb={6}
                status="warning"
              >
                {'Funding the Bundlr uses real currency! Devs should use MATIC.'}
              </Alert>
            )}
            <FormLabel>Amount</FormLabel>
            <Flex>
              <NumberInput
                flex={1}
                onChange={handleAmountChange}
                value={amount}
                isDisabled={isFunding}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button
                ml={6}
                float="right"
                w="150px"
                disabled={!isAmountValid || isFunding}
                isLoading={isFunding}
                onClick={handleFund}
              >
                Fund
              </Button>
            </Flex>
          </FormControl>
        </>
      )}
    </VStack>
  );
}
