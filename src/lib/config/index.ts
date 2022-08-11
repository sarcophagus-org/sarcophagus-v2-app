import React, { createContext, useContext } from 'react';
import { NetworkConfig } from './networkConfigType';

export const ConfigContext = createContext<NetworkConfig | undefined>(
  {} as NetworkConfig | undefined
);

export function useNetworkConfig(): NetworkConfig | undefined {
  return useContext(ConfigContext);
}
