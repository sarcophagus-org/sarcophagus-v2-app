import { createContext, useContext } from 'react';

interface SupportedNetwork {
  isSupportedChain: boolean;
  isInitialisingSarcoSdk: boolean;
  isSarcoInitialized: boolean;
  isBundlrConnected: boolean;
  setIsBundlrConnected: Function;
  supportedNetworkNames: string[];
}

export const SupportedNetworkContext = createContext<SupportedNetwork>({} as SupportedNetwork);

// TODO: Rename to something more appropriate. `useNetworkInfo`?
export function useSupportedNetwork(): SupportedNetwork {
  return useContext(SupportedNetworkContext);
}
