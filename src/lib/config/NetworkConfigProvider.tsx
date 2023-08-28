import { NetworkConfigContext } from '.';
import { SupportedNetworkContext } from './useSupportedNetwork';
import { useNetwork } from 'wagmi';
import { emptyConfig, networkConfigs } from './networkConfigs';
import { NetworkConfig } from './networkConfigType';
import { useMemo, useState } from 'react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const [currentChainId, setCurrentChainId] = useState<number | undefined>();
  const [isInitialisingSarcoSdk, setIsInitialisingSarcoSdk] = useState(false);
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [isBundlrConnected, setIsBundlrConnected] = useState(false);

  const networkConfig: NetworkConfig = useMemo(() => {
    const validChain = !!chain && !!networkConfigs[chain.id];
    const config = validChain ? networkConfigs[chain.id] : emptyConfig;

    if (isInitialisingSarcoSdk) return config;

    const initSarcoSdk = (chainId: number) =>
      sarco
        .init({
          chainId: chainId,
          etherscanApiKey: config.etherscanApiKey,
          zeroExApiKey: process.env.REACT_APP_ZERO_EX_API_KEY,
        })
        .then(() => {
          setCurrentChainId(chain?.id);
          setIsInitialisingSarcoSdk(false);
          setIsSdkInitialized(true);
        });

    const chainChanged = chain?.id !== currentChainId;
    if (chainChanged) {
      setIsInitialisingSarcoSdk(true);
      setIsSdkInitialized(false);

      new Promise<void>(res => setTimeout(() => res(), 10)).then(() => {
        if (validChain) {
          initSarcoSdk(chain.id);
        } else {
          setCurrentChainId(chain?.id);
          setIsInitialisingSarcoSdk(false);
        }
      });
    }

    if (validChain && !isSdkInitialized) {
      setIsInitialisingSarcoSdk(true);
      initSarcoSdk(chain.id);
    }

    return sarco.isInitialised && validChain ? config : emptyConfig;
  }, [chain, currentChainId, isSdkInitialized, isInitialisingSarcoSdk]);

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(',').map(id => parseInt(id)) || [];

  const isSupportedChain = supportedChainIds.includes(networkConfig.chainId);

  const supportedNetworkNames = Object.values(networkConfigs)
    .filter(config => supportedChainIds.includes(config.chainId))
    .map(config => config.networkShortName);

  return (
    <NetworkConfigContext.Provider value={networkConfig}>
      <SupportedNetworkContext.Provider
        value={{
          isInitialisingSarcoSdk: isInitialisingSarcoSdk,
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
