import { SarcoNetworkConfig } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import { createContext, useContext } from 'react';

export const NetworkConfigContext = createContext<SarcoNetworkConfig>({} as SarcoNetworkConfig);

export function useNetworkConfig(): SarcoNetworkConfig {
  return useContext(NetworkConfigContext);
}
