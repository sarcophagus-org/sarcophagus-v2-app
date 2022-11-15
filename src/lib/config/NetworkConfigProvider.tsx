import { NetworkConfigContext } from '.';
import { SupportedNetworkContext } from './useSupportedNetwork';
import { useNetwork } from 'wagmi';
import { networkConfigs } from './networkConfigs';
import { NetworkConfig } from './networkConfigType';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const networkConfig: NetworkConfig = !!chain
    ? networkConfigs[chain.id]
      ? networkConfigs[chain.id]
      : ({
          chainId: 0,
          networkName: '',
          networkShortName: '',
          sarcoTokenAddress: '',
          diamondDeployAddress: '',
          explorerUrl: '',
          explorerApiKey: '',
          bundlr: {
            currencyName: '',
            nodeUrl: '',
            providerUrl: '',
          },
        } as NetworkConfig)
    : ({} as NetworkConfig);

  const supportedChainIds =
    process.env.REACT_APP_SUPPORTED_CHAIN_IDS?.split(',').map(id => parseInt(id)) || [];

  const isSupportedChain = supportedChainIds.includes(networkConfig.chainId);

  const supportedNetworkNames = Object.values(networkConfigs)
    .filter(config => supportedChainIds.includes(config.chainId))
    .map(config => config.networkShortName);

  return (
    <NetworkConfigContext.Provider value={networkConfig}>
      <SupportedNetworkContext.Provider
        value={{ isSupportedChain: isSupportedChain, supportedNetworkNames: supportedNetworkNames }}
      >
        {children}
      </SupportedNetworkContext.Provider>
    </NetworkConfigContext.Provider>
  );
}
