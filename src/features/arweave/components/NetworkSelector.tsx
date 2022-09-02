import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useBundlrSession } from 'features/embalm/stepContent/hooks/useBundlrSession';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { mainnetNetworkConfig } from '../../../lib/config/mainnet';
import { maticNetworkConfig } from '../../../lib/config/matic';

/**
 * This is a temporary component meant to be used as a showcase for the arweave bundlr functionality
 * Use wagmi native selector for network selection
 */
export function NetworkSelector() {
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork();
  const { disconnectFromBundlr } = useBundlrSession();
  const { chain } = useNetwork();
  const ethChainId = Number(mainnetNetworkConfig.chainId);
  const maticChainId = Number(maticNetworkConfig.chainId);

  function handleClickEthereum() {
    switchNetwork?.(ethChainId);

    // Need to disconnect so the balance will update
    disconnectFromBundlr();
  }

  function handleClickMatic() {
    switchNetwork?.(maticChainId);

    // Need to disconnect so the balance will update
    disconnectFromBundlr();
  }

  return (
    <Flex
      direction="column"
      mt={6}
    >
      <Heading size="md">Select Network</Heading>
      <Text
        color="#999"
        mt={6}
      >
        Connected to <b>{chain?.name}</b>
      </Text>
      <Flex mt={3}>
        <Flex
          direction="column"
          align="center"
        >
          <Text
            color="#999"
            fontSize="sm"
          >
            Expensive
          </Text>
          <Button
            mt={1}
            width={100}
            disabled={chain?.id === ethChainId}
            isLoading={isLoading && pendingChainId === ethChainId}
            onClick={handleClickEthereum}
          >
            Ethereum
          </Button>
        </Flex>
        <Flex
          ml={6}
          direction="column"
          align="center"
        >
          <Text
            color="#999"
            fontSize="sm"
          >
            Cheaper (use for development)
          </Text>
          <Button
            mt={1}
            width={100}
            disabled={chain?.id === maticChainId}
            isLoading={isLoading && pendingChainId === maticChainId}
            onClick={handleClickMatic}
          >
            Matic
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
