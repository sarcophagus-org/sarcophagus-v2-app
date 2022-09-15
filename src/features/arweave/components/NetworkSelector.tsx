import { Button, VStack, HStack, Heading, Text } from '@chakra-ui/react';
import { useBundlrSession } from 'features/embalm/stepContent/hooks/useBundlrSession';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { mainnetNetworkConfig } from 'lib/config/mainnet';
import { maticNetworkConfig } from 'lib/config/matic';
import { goerliNetworkConfig } from 'lib/config/goerli';

/**
 * This is a temporary component meant to be used as a showcase for the arweave bundlr functionality
 * Use wagmi native selector for network selection
 */
export function NetworkSelector() {
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork();
  const { disconnectFromBundlr } = useBundlrSession();
  const { chain } = useNetwork();
  const ethChainId = mainnetNetworkConfig.chainId;
  const maticChainId = maticNetworkConfig.chainId;
  const goerliChainId = goerliNetworkConfig.chainId;

  function handleClickEthereum() {
    switchNetwork?.(ethChainId);
    disconnectFromBundlr();
  }

  function handleClickMatic() {
    switchNetwork?.(maticChainId);
    disconnectFromBundlr();
  }

  function handleClickGoerli() {
    switchNetwork?.(goerliChainId);
    disconnectFromBundlr();
  }

  return (
    <VStack
      spacing={3}
      align="left"
    >
      <Heading size="md">Select Network</Heading>
      <Text mt={6}>
        Connected to <b>{chain?.name}</b>
      </Text>
      <HStack spacing={10}>
        <VStack>
          <Text fontSize="sm">Expensive</Text>
          <Button
            width={100}
            disabled={chain?.id === ethChainId}
            isLoading={isLoading && pendingChainId === ethChainId}
            onClick={handleClickEthereum}
          >
            Ethereum
          </Button>
        </VStack>
        <VStack>
          <Text fontSize="sm">Cheaper (use for development)</Text>
          <Button
            width={100}
            disabled={chain?.id === maticChainId}
            isLoading={isLoading && pendingChainId === maticChainId}
            onClick={handleClickMatic}
          >
            Matic
          </Button>
        </VStack>
        <VStack>
          <Text fontSize="sm">Testnet</Text>
          <Button
            width={100}
            disabled={chain?.id === goerliChainId}
            isLoading={isLoading && pendingChainId === goerliChainId}
            onClick={handleClickGoerli}
          >
            Goerli
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
}
