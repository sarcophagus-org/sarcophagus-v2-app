import { createContext, useContext } from 'react';
import { NetworkConfig } from './networkConfigType';

export const NetworkConfigContext = createContext<NetworkConfig>({} as NetworkConfig);

export function useNetworkConfig(): NetworkConfig {
  return useContext(NetworkConfigContext);
}
