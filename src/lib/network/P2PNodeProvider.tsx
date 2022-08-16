import { Libp2p, createLibp2p } from 'libp2p';
import { createContext } from 'react';
import { nodeConfig } from 'lib/utils/node_config';

export const LibP2pContext = createContext<Promise<Libp2p> | undefined>(undefined);

export function P2PNodeProvider({ children }: { children: React.ReactNode }) {
  //@ts-ignore
  const p2pNode = createLibp2p(nodeConfig);

  return <LibP2pContext.Provider value={p2pNode}>{children}</LibP2pContext.Provider>;
}
