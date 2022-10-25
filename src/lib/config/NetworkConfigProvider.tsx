import { NetworkConfigContext } from '.';
import { useNetwork } from 'wagmi';
import { networkConfigs } from './networkConfig';
import { NetworkConfig } from './networkConfigType';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();
  // TODO: when will chain be empty? Should there be a network config in that scenario?
  const networkConfig: NetworkConfig = !!chain
    ? networkConfigs[chain.id]
    : {
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
      };

  return (
    <NetworkConfigContext.Provider value={networkConfig}>{children}</NetworkConfigContext.Provider>
  );
}
