import { ConfigContext } from '.';
import { useNetwork } from 'wagmi';
import { AllNetworkConfigs } from './networkConfig';

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const networkConfig = chain && AllNetworkConfigs[chain.id];

  return <ConfigContext.Provider value={networkConfig}>{children}</ConfigContext.Provider>;
}
