import { NetworkConfigContext } from '.';
import { SupportedNetworkContext } from './useSupportedNetwork';
import { useNetwork } from 'wagmi';
import { emptyConfig, networkConfigs } from './networkConfigs';
import { NetworkConfig } from './networkConfigType';
import { useCallback, useEffect, useState } from 'react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [isBundlrConnected, setIsBundlrConnected] = useState(false);
  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>(emptyConfig);

  const initializeSdk = useCallback(async () => {
    const validChain = !!chain && !!networkConfigs[chain.id];
    const config = validChain ? networkConfigs[chain.id] : emptyConfig;

    if (validChain && !isSdkInitialized) {
      try {
        await sarco.init({
          chainId: chain.id,
          etherscanApiKey: config.etherscanApiKey,
          zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY,
        });
        setIsSdkInitialized(true);
        setNetworkConfig(config);
      } catch {
        setIsSdkInitialized(false);
        return;
      }
    }
  }, [chain, isSdkInitialized]);

  useEffect(() => {
    (async () => {
      await initializeSdk();
    })();
  }, [initializeSdk]);

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(',').map(id => parseInt(id)) || [];

  const isSupportedChain = supportedChainIds.includes(networkConfig.chainId ?? 0);

  const supportedNetworkNames = Object.values(networkConfigs)
    .filter(config => supportedChainIds.includes(config.chainId))
    .map(config => config.networkShortName);

  if (!networkConfig) {
    return <></>;
  }

  return (
    <NetworkConfigContext.Provider value={networkConfig}>
      <SupportedNetworkContext.Provider
        value={{
          isSarcoInitialized: isSdkInitialized,
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
