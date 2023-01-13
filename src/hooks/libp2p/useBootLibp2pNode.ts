import { nodeConfig } from 'lib/config/node_config';
import { createLibp2p, Libp2p } from 'libp2p';
import { useCallback, useEffect } from 'react';
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

export function useBootLibp2pNode(discoveryPeriod?: number) {
  const dispatch = useDispatch();
  const globalLibp2pNode = useSelector(s => s.appState.libp2pNode);
  const { onPeerDiscovery } = useLibp2p();

  const addPeerDiscoveryEventListener = useCallback(
    (libp2pNode: Libp2p): void => {
      libp2pNode.addEventListener('peer:discovery', onPeerDiscovery);

      // TODO: Remove this once we refactor how libp2p works
      // Sets a limited time discovery period by removing the listener after a certain period of
      // time. This is a temporary fix to prevent the discovery listener from causing components to
      // render endlessly.
      if (discoveryPeriod) {
        setTimeout(() => {
          libp2pNode.removeEventListener('peer:discovery', onPeerDiscovery);
        }, discoveryPeriod);
      }
    },
    [onPeerDiscovery, discoveryPeriod]
  );

  // const addPeerDisconnectEventListener = useCallback(
  //   (libp2pNode: Libp2p): void => {
  //     libp2pNode.connectionManager.addEventListener('peer:disconnect', onPeerDisconnect);
  //   },
  //   [onPeerDisconnect]
  // );

  const createAndStartNode = useCallback(async (): Promise<void> => {
    const newLibp2pNode = await createLibp2p(nodeConfig);
    await newLibp2pNode.start();
    log(`Browser node starting with peerID: ${newLibp2pNode.peerId.toString()}`);

    // TODO: re-add once peer discovery is re-added
    // addPeerDiscoveryEventListener(newLibp2pNode);
    // addPeerDisconnectEventListener(newLibp2pNode);

    // set global libp2p node for later use
    dispatch(setLibp2p(newLibp2pNode));
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        if (!globalLibp2pNode) {
          await createAndStartNode();
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [createAndStartNode, globalLibp2pNode]);

  return { addPeerDiscoveryEventListener, createAndStartNode };
}
