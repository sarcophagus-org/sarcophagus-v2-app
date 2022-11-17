import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { useCallback, useState } from 'react';
import { setBalance } from 'store/bundlr/actions';
import { useDispatch, useSelector } from 'store/index';
import { uploadPriceDecimals } from 'lib/constants';
import { ethers } from 'ethers';
import { useBundlrSession } from '../hooks/useBundlrSession';
import { useGetBalance } from '../hooks/useGetBalance';

export function Bundlr({ children }: { children?: React.ReactNode }) {
  const dispatch = useDispatch();
  const { fund, isFunding } = useBundlr();
  const { connectToBundlr, isConnected, disconnectFromBundlr } = useBundlrSession();
  const { getBalance, formattedBalance } = useGetBalance();
  const { uploadPrice, formattedUploadPrice, uploadPriceBN } = useUploadPrice();
  const [amount, setAmount] = useState(parseFloat(uploadPrice || '0').toFixed(uploadPriceDecimals));
  const { pendingBalance } = useSelector(x => x.bundlrState);

  const isAmountValid = parseFloat(amount) > 0;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (Number(value) < 0 || !ethers.utils.parseEther(value)) return;
    const inputLimit = 46;
    setAmount(value.slice(0, inputLimit));
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
              <InputGroup
                flex={1}
                mr={3}
              >
                <Input
                  onChange={handleInputChange}
                  value={amount}
                  isDisabled={isFunding}
                  type="text"
                  placeholder="0.00000000"
                  _placeholder={{ color: 'inherit' }}
                />
                <InputRightElement fontWeight={700}>ETH</InputRightElement>
              </InputGroup>
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
            {uploadPriceBN.gt(0) && (
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
