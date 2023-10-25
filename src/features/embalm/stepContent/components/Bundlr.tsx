import { Button, FormControl, FormLabel, HStack, Text, VStack } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { BundlrInput } from 'features/bundlr/BundlrInput';
import { useBundlr } from 'features/embalm/stepContent/hooks/useBundlr';
import { useUploadPrice } from 'features/embalm/stepNavigator/hooks/useUploadPrice';
import { useCallback, useState } from 'react';
import { useSelector } from 'store/index';
import { useNetwork } from 'wagmi';
import { useBundlrSession } from '../hooks/useBundlrSession';
import { useBundlrBalance } from '../hooks/useBundlrBalance';
import { useSupportedNetwork } from 'lib/config/useSupportedNetwork';
import { WalletBalance } from 'features/bundlr/WalletBalance';

export function Bundlr({ children }: { children?: React.ReactNode }) {
  const { fund, isFunding } = useBundlr();
  const { connectToBundlr, disconnectFromBundlr } = useBundlrSession();
  const { formattedBalance } = useBundlrBalance();
  const { uploadPrice, formattedUploadPrice } = useUploadPrice();

  const { isBundlrConnected } = useSupportedNetwork();

  const { balanceOffset } = useSelector(x => x.bundlrState);
  const { chain } = useNetwork();

  function handleDisconnect() {
    disconnectFromBundlr();
  }

  const [inputAmountBN, setInputAmountBN] = useState<BigNumber>();

  const handleFund = useCallback(async () => {
    if (!inputAmountBN) return;
    console.log('fund', inputAmountBN.toString());
    await fund(inputAmountBN);
  }, [fund, inputAmountBN]);

  return (
    <VStack
      align="left"
      w="100%"
    >
      {!isBundlrConnected ? (
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
              <BundlrInput
                initialAmount={
                  uploadPrice && !uploadPrice.eq(ethers.constants.Zero) ? uploadPrice : undefined
                }
                inputHeight="40px"
                onInputChange={(input: BigNumber | undefined) => {
                  setInputAmountBN(input);
                }}
              />
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
            <WalletBalance />
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
