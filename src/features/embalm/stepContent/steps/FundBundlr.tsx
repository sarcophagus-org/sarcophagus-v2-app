import {
  Button,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
} from '@chakra-ui/react';
import { Alert } from 'components/Alert';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { useCallback, useState } from 'react';
import { setBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useBundlrSession } from '../hooks/useBundlrSession';
import { useGetBalance } from '../hooks/useGetBalance';
import { uploadPriceDecimals } from 'lib/constants';
import { Bundlr } from '../../../../../src/components/Bundlr';

// export function FundBundlr() {
//   return <Bundlr />;
// }

export function FundBundlr() {
  const dispatch = useDispatch();
  const { fund, isFunding } = useBundlr();
  const { connectToBundlr, isConnected, disconnectFromBundlr } = useBundlrSession();
  const { balance, getBalance, formattedBalance } = useGetBalance();
  const { uploadPrice, formattedUploadPrice } = useUploadPrice();
  const file = useSelector(x => x.embalmState.file);
  const [amount, setAmount] = useState(parseFloat(uploadPrice || '0').toFixed(uploadPriceDecimals));

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

  function AlertMessage() {
    if (!file) {
      return <Alert status="warning">Upload a payload to get the upload price.</Alert>;
    }

    if (parseFloat(balance) < parseFloat(uploadPrice)) {
      return <Alert status="warning">You need to add funds to Bundlr.</Alert>;
    }

    return (
      <Alert status="success">
        You have enough funds in Bundlr. You can top up your balance or continue to the next step.
      </Alert>
    );
  }

  return (
    <VStack
      align="left"
      w="100%"
    >
      <Text
        mb={6}
        variant="secondary"
      >
        Bundlr will package your payload and send to Arweave using Ethereum.
      </Text>
      {!isConnected ? (
        <VStack
          py={8}
          spacing={6}
        >
          <Text>Click to connect to Arweave Bundlr</Text>
          <Button onClick={connectToBundlr}>Connect to Bundlr</Button>
        </VStack>
      ) : (
        <VStack
          align="left"
          pt={2}
        >
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <HStack>
              <NumberInput
                flex={1}
                onChange={handleAmountChange}
                value={amount}
                isDisabled={isFunding}
                mr={3}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button
                float="right"
                w="150px"
                disabled={!isAmountValid || isFunding}
                isLoading={isFunding}
                onClick={handleFund}
              >
                Add Funds
              </Button>
            </HStack>
          </FormControl>
          <Box py={3}>
            <AlertMessage />
          </Box>
          <VStack
            border="1px solid "
            borderColor="violet.700"
            spacing={0}
            align="left"
            p={3}
          >
            <HStack
              spacing={0}
              justify="space-between"
              align="flex-start"
            >
              <Text>Connected to Bundlr service.</Text>
              <Button
                ml={6}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </HStack>
            <Text variant="secondary">Bundlr balance: {formattedBalance}</Text>
            <Text variant="secondary">Estimated payload price: {formattedUploadPrice}</Text>
          </VStack>
        </VStack>
      )}
      <Flex p="15px" />
      <h1>COMPONENT:</h1>
      <Bundlr />
    </VStack>
  );
}
