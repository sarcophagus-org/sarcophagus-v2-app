import { nodeConfig } from 'lib/config/node_config';
import { createLibp2p, Libp2p } from 'libp2p';
import { useEffect } from 'react';
import { setLibp2p } from 'store/app/actions';
import { useDispatch, useSelector } from 'store/index';
import { log } from '../../lib/utils/logger';
import { useLibp2p } from './useLibp2p';

/**
 * This hook is responsible for initializing a libp2p node
 * The browser uses this node to communicate with archaeologists
 * who themselves are libp2p nodes
 *
 * Boot Sequence:
 * 1. Initialize node with a pre-defined config
 * 2. Start the node
 * 3. Add event listeners to the node for peer discovery and connection
 */

export function useBootLibp2pNode() {
  const dispatch = useDispatch();
  const globalLibp2pNode = useSelector(s => s.appState.libp2pNode);
  const { handlePublicKeyStream, onPeerConnect, onPeerDisconnect, onPeerDiscovery } = useLibp2p();

  const createAndSetNode = async (): Promise<Libp2p> => {
    const newLibp2pNode = await createLibp2p(nodeConfig);

    // set global libp2p node for later use
    dispatch(
      setLibp2p(
        newLibp2pNode
      )
    );

    return newLibp2pNode;
  };

  const addNodeEventListeners = (libp2pNode: Libp2p): void => {
    libp2pNode.addEventListener('peer:discovery', onPeerDiscovery);
    libp2pNode.connectionManager.addEventListener('peer:connect', onPeerConnect);
    libp2pNode.connectionManager.addEventListener('peer:disconnect', onPeerDisconnect);
  };

  useEffect(() => {
    (async () => {
      try {
        if (!globalLibp2pNode) {
          const newLibp2pNode = await createAndSetNode();
          await newLibp2pNode.start();

          log(`Browser node starting with peerID: ${newLibp2pNode.peerId.toString()}`);

          addNodeEventListeners(newLibp2pNode);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [dispatch, globalLibp2pNode, handlePublicKeyStream, onPeerConnect, onPeerDisconnect, onPeerDiscovery]);


  // TODO: This method is not called.
  // Need to find correct place to call this without disrupting the event listeners
  // Was previously removing on unmount of the useLibp2p hook, but that was not working
  const removeNodeEventListeners = (libp2pNode: Libp2p): void => {
    libp2pNode.removeEventListener('peer:discovery', onPeerDiscovery);
    libp2pNode.connectionManager.removeEventListener('peer:connect', onPeerConnect);
    libp2pNode.connectionManager.removeEventListener('peer:disconnect', onPeerDisconnect);
  };
}
