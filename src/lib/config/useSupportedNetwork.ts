import { createContext, useContext } from 'react';

interface SupportedNetwork {
  isSupportedChain: boolean;
  supportedNetworkNames: string[];
}

export const SupportedNetworkContext = createContext<SupportedNetwork>({} as SupportedNetwork);

export function useSupportedNetwork(): SupportedNetwork {
  return useContext(SupportedNetworkContext);
}
