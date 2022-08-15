import React, { createContext, useContext } from 'react';
import { NetworkConfig } from './networkConfigType';

export const NetworkConfigContext = createContext<NetworkConfig | undefined>(
  {} as NetworkConfig | undefined
);

export function useNetworkConfig(): NetworkConfig | undefined {
  return useContext(NetworkConfigContext);
}
