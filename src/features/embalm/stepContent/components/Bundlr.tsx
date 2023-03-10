import { Button, FormControl, FormLabel, HStack, Text, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useBundlrInput } from 'features/bundlr/useBundlrInput';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { useCallback } from 'react';
import { useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { useBundlrSession } from '../hooks/useBundlrSession';
import { useGetBalance } from '../hooks/useGetBalance';

export function Bundlr({ children }: { children?: React.ReactNode }) {
  const { fund, isFunding } = useBundlr();
  const { connectToBundlr, disconnectFromBundlr, isConnected } = useBundlrSession();
  const { formattedBalance } = useGetBalance();
  const { uploadPrice, formattedUploadPrice } = useUploadPrice();

  const { balanceOffset } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();

  function handleDisconnect() {
    disconnectFromBundlr();
  }

  const { BundlrInput, inputAmountBN } = useBundlrInput({
    initialAmount:
      uploadPrice && !uploadPrice.eq(ethers.constants.Zero)
        ? parseFloat(ethers.utils.formatUnits(uploadPrice))
        : undefined,
    inputHeight: '40px',
  });

  const handleFund = useCallback(async () => {
    if (!inputAmountBN) return;
    await fund(inputAmountBN);
  }, [inputAmountBN, fund]);

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
          <Text variant="secondary">Click to connect to Arweave Bundlr</Text>
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
              {BundlrInput}
              <Button
                float="right"
                disabled={!inputAmountBN || isFunding}
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
            borderColor="grayBlue.700"
            spacing={0}
            align="left"
            p={3}
          >
            <HStack
              spacing={0}
              justify="space-between"
              align="flex-start"
            >
              <Text variant="bold">Connected to Bundlr service.</Text>
              <Button
                ml={6}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </HStack>
            <Text>Bundlr balance: {formattedBalance}</Text>
            {!balanceOffset.eq(ethers.constants.Zero) && (
              <Text
                mt={3}
                color="error"
              >
                Pending Balance:{' '}
                {`${parseFloat(ethers.utils.formatUnits(balanceOffset)).toFixed(8)} ${
                  chain?.nativeCurrency?.name || 'ETH'
                }`}
              </Text>
            )}
            {uploadPrice.gt(0) && <Text>Estimated payload price: {formattedUploadPrice}</Text>}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
}
