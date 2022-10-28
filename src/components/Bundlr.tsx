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
} from '@chakra-ui/react';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { useCallback, useState } from 'react';
import { setBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { useBundlrSession } from '../features/embalm/stepContent/hooks/useBundlrSession';
import { useGetBalance } from '../features/embalm/stepContent/hooks/useGetBalance';
import { uploadPriceDecimals } from 'lib/constants';

export function Bundlr({ children }: { children?: React.ReactNode }) {
  const dispatch = useDispatch();
  const { fund, isFunding } = useBundlr();
  const { connectToBundlr, isConnected, disconnectFromBundlr } = useBundlrSession();
  const { getBalance, formattedBalance } = useGetBalance();
  const { uploadPrice, formattedUploadPrice } = useUploadPrice();
  const [amount, setAmount] = useState(parseFloat(uploadPrice || '0').toFixed(uploadPriceDecimals));
  const { pendingBalance } = useSelector(x => x.bundlrState);
  const ONE_WEI = '0.000000000000000001';

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
      align="left"
      w="100%"
    >
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
                <Text
                  p="2.5"
                  variant="bold"
                  position="absolute"
                  right="7"
                  top="0"
                >
                  ETH
                </Text>
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
          {children}
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
            {formattedUploadPrice > ONE_WEI && (
              <Text variant="secondary">Estimated payload price: {formattedUploadPrice}</Text>
            )}
          </VStack>
          {pendingBalance.txId && (
            <Text
              mt={3}
              color="error"
            >
              You have a pending balance update. Your balance should be updated in a few minutes
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  );
}
