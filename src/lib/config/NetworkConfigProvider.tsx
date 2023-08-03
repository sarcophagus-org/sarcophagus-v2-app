import { NetworkConfigContext } from '.';
import { SupportedNetworkContext } from './useSupportedNetwork';
import { useNetwork } from 'wagmi';
import { networkConfigs } from './networkConfigs';
import { NetworkConfig } from './networkConfigType';
import { useMemo, useState } from 'react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const [isSarcoInitialized, setSarcoInitialised] = useState(false);
  const [isBundlrConnected, setIsBundlrConnected] = useState(false);

  const networkConfig: NetworkConfig | null = useMemo(() => {
    const emptyConfig: NetworkConfig = {
      chainId: 0,
      networkName: '',
      networkShortName: '',
      sarcoTokenAddress: '',
      diamondDeployAddress: '',
      explorerUrl: '',
      etherscanApiUrl: '',
      etherscanApiKey: '',
      bundlr: {
        currencyName: '',
        nodeUrl: '',
        providerUrl: '',
      },
      arweaveConfig: {
        host: '',
        port: 0,
        protocol: 'https',
        timeout: 0,
        logging: false,
      },
      subgraphUrl: '',
    };

    const validChain = !!chain && !!networkConfigs[chain.id];
    const config = validChain ? networkConfigs[chain.id] : emptyConfig;

    if (validChain && !isSarcoInitialized) {
      sarco
        .init({
          chainId: chain.id,
          etherscanApiKey: config.etherscanApiKey,
        })
        .then(() => setSarcoInitialised(true));
    }

    return sarco.isInitialised ? config : emptyConfig;
  }, [chain, isSarcoInitialized]);

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(',').map(id => parseInt(id)) || [];

  const isSupportedChain = supportedChainIds.includes(networkConfig?.chainId ?? 0);

  const supportedNetworkNames = Object.values(networkConfigs)
    .filter(config => supportedChainIds.includes(config.chainId))
    .map(config => config.networkShortName);

  return (
    <NetworkConfigContext.Provider value={networkConfig}>
      <SupportedNetworkContext.Provider
        value={{
          isSarcoInitialized,
          isBundlrConnected,
          setIsBundlrConnected,
          isSupportedChain: isSupportedChain,
          supportedNetworkNames: supportedNetworkNames,
        }}
      >
        {children}
      </SupportedNetworkContext.Provider>
    </NetworkConfigContext.Provider>
  );
}
