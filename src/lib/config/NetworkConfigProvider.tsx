import { NetworkConfigContext } from '.';
import { useNetwork } from 'wagmi';
import { supportedNetworkConfigs } from './networkConfig';
import { NetworkConfig } from './networkConfigType';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const networkConfig: NetworkConfig = !!chain
    ? supportedNetworkConfigs[chain.id]
    : {
        chainId: 0,
        networkName: '',
        networkShortName: '',
        sarcoTokenAddress: '',
        diamondDeployAddress: '',
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
