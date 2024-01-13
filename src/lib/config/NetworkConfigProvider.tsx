import { NetworkConfigContext } from '.';
import { SupportedNetworkContext } from './useSupportedNetwork';
import { useNetwork } from 'wagmi';
import { emptyConfig } from './networkConfigs';
import { useEffect, useState } from 'react';
import {
  sarco,
  SARCO_SUPPORTED_NETWORKS,
  SarcoNetworkConfig,
} from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const [currentChainId, setCurrentChainId] = useState<number | undefined>();
  const [isInitialisingSarcoSdk, setIsInitialisingSarcoSdk] = useState(false);
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [isBundlrConnected, setIsBundlrConnected] = useState(false);
  const [networkConfig, setNetworkConfig] = useState<SarcoNetworkConfig>(emptyConfig);

  const sdkSupportedChainIds = Array.from(SARCO_SUPPORTED_NETWORKS.keys());

  useEffect(() => {
    const validChain = !!chain && sdkSupportedChainIds.includes(chain.id);

    if (isInitialisingSarcoSdk) return;

    const initSarcoSdk = async (chainId: number) => {
      const sarcoNetworkConfig = await sarco.init({ chainId });
      setCurrentChainId(chain?.id);
      setNetworkConfig(sarcoNetworkConfig);
      setIsInitialisingSarcoSdk(false);
      setIsSdkInitialized(true);
      console.log('finished initting');
    };

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
  }, [chain, currentChainId, isSdkInitialized, isInitialisingSarcoSdk, sdkSupportedChainIds]);

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(',').map(id => parseInt(id)) || [];

  const isSupportedChain = supportedChainIds.includes(networkConfig.chainId);

  const supportedNetworkNames = sdkSupportedChainIds
    .filter(chainId => supportedChainIds.includes(chainId))
    .map(chainId => SARCO_SUPPORTED_NETWORKS.get(chainId)!);

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
