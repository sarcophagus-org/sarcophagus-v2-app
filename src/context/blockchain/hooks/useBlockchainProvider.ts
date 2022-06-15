import { createContext, useContext } from 'react';

export interface IBlockchainProviderContext {}

export const BlockchainProviderContext = createContext<IBlockchainProviderContext | null>(null);

export function useBlockchainProvider(): IBlockchainProviderContext {
  return useContext(BlockchainProviderContext as React.Context<IBlockchainProviderContext>);
}
