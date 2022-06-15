import type { ChildrenOnly } from '../types';
import { BlockchainProvider } from './blockchain/BlockChainProvider';
import { Web3Provider } from './web3/Web3Provider';

export function ContextProviders({ children }: ChildrenOnly) {
  return (
    <Web3Provider>
      <BlockchainProvider>{children}</BlockchainProvider>
    </Web3Provider>
  );
}
