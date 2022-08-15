import { NetworkConfigContext } from '.';
import { useNetwork } from 'wagmi';
import { AllNetworkConfigs } from './networkConfig';

export function NetworkConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const networkConfig = chain && AllNetworkConfigs[chain.id];

  return (
    <NetworkConfigContext.Provider value={networkConfig}>{children}</NetworkConfigContext.Provider>
  );
}
