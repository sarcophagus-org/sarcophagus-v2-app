import { useMemo } from 'react';
import { ChildrenOnly } from '../../types';
import { useWeb3Provider } from '../web3/hooks/useWeb3Provider';
import { BlockchainProviderContext } from './hooks/useBlockchainProvider';
import { useCurrentBlock } from './hooks/useCurrentBlock';

export function BlockchainProvider({ children }: ChildrenOnly) {
  const {
    state: { provider },
  } = useWeb3Provider();
  // @todo load contracts here

  const currrentBlock = useCurrentBlock(provider);

  const contextValue = useMemo(() => ({ currrentBlock }), [currrentBlock]);

  return (
    <BlockchainProviderContext.Provider value={contextValue}>
      {children}
    </BlockchainProviderContext.Provider>
  );
}
