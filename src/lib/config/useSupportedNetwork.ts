import { createContext, useContext } from 'react';

interface SupportedNetwork {
  isSupportedChain: boolean;
  isSarcoInitialized: boolean;
  supportedNetworkNames: string[];
}

export const SupportedNetworkContext = createContext<SupportedNetwork>({} as SupportedNetwork);

// TODO: Rename to something more appropriate
export function useSupportedNetwork(): SupportedNetwork {
  return useContext(SupportedNetworkContext);
}
