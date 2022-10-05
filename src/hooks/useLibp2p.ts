import { Connection } from '@libp2p/interface-connection';
import { PeerInfo } from '@libp2p/interface-peer-info';
import { StreamHandler } from '@libp2p/interface-registrar';
import { ethers } from 'ethers';
import { pipe } from 'it-pipe';
import { nodeConfig } from 'lib/config/node_config';
import { createLibp2p } from 'libp2p';
import { useCallback, useEffect } from 'react';
import { setLibp2p } from 'store/app/actions';
import { setArchaeologistConnection, setArchaeologistFullPeerId, setArchaeologistOnlineStatus } from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';

export function useLibp2p() {
  const dispatch = useDispatch();
  const libp2pNode = useSelector(s => s.appState.libp2pNode);
  const { archaeologists, selectedArchaeologists } = useSelector(s => s.embalmState);

  const onPeerDiscovery = useCallback(
    (evt: CustomEvent<PeerInfo>) => {
      const peerId = evt.detail.id;
      dispatch(setArchaeologistOnlineStatus(peerId.toString(), true));
      dispatch(setArchaeologistFullPeerId(peerId));
    },
    [dispatch]
  );

  const onPeerConnect = useCallback(
    (evt: CustomEvent<Connection>) => {
      const peerId = evt.detail.remotePeer.toString();
      dispatch(setArchaeologistConnection(peerId, evt.detail));
    },
    [dispatch]
  );

  const onPeerDisconnect = useCallback(
    (evt: CustomEvent<Connection>) => {
      const peerId = evt.detail.remotePeer.toString();
      dispatch(setArchaeologistOnlineStatus(peerId, false));
      dispatch(setArchaeologistConnection(peerId, undefined));
    },
    [dispatch]
  );

  const handlePublicKeyMsgStream: StreamHandler = useCallback(
    ({ stream }) => {
      pipe(stream, async function (source) {
        for await (const msg of source) {
          try {
            const decoded = new TextDecoder().decode(msg);
            console.info(`received public key ${decoded}`);

            const archConfigJson: Record<string, any> = JSON.parse(decoded);

            const signerAddress = ethers.utils.verifyMessage(
              JSON.stringify({
                encryptionPublicKey: archConfigJson.encryptionPublicKey,
                peerId: archConfigJson.peerId,
              }),
              archConfigJson.signature
            );

            const i = archaeologists.findIndex(a => a.profile.archAddress === signerAddress);

            if (i !== -1) {
              const arch = archaeologists[i];
              // TODO: Determine if there's a better way to be certain of origin's peerId
              if (arch.profile.peerId !== archConfigJson.peerId) {
                // This is POSSIBLE, but in practice shouldn't ever happen.
                // But that's how you know it'll DEFINITELY happen eh? Sigh.
                console.error('Peer ID mismatch'); // TODO: Handle this problem better. Relay feedback to user.
                return;
              }

              console.log('got public key of', arch.profile.peerId);
              arch.publicKey = archConfigJson.encryptionPublicKey;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }).finally(() => {
        // clean up resources
        stream.close();
      });
    },
    [archaeologists]
  );

  // Sets a new libp2p node instance
  useEffect(() => {
    (async () => {
      try {
        if (!libp2pNode) {
          const newLibp2pNode = await createLibp2p(nodeConfig);
          dispatch(setLibp2p(newLibp2pNode));
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [dispatch, libp2pNode]);

  // Sets up the libp2p listeners
  useEffect(() => {
    (async () => {
      try {
        if (!libp2pNode) return;
        if (libp2pNode.isStarted()) return;

        await libp2pNode.start();

        libp2pNode.addEventListener('peer:discovery', onPeerDiscovery);
        libp2pNode.connectionManager.addEventListener('peer:connect', onPeerConnect);
        libp2pNode.connectionManager.addEventListener('peer:disconnect', onPeerDisconnect);
        libp2pNode.handle(['/public-key'], handlePublicKeyMsgStream);
      } catch (error) {
        console.error(error);
      }
    })();

    // Remove the event listeners on unmount
    return () => {
      if (!libp2pNode) return;
      libp2pNode.removeEventListener('peer:discovery', onPeerDiscovery);
      libp2pNode.connectionManager.removeEventListener('peer:connect', onPeerConnect);
      libp2pNode.connectionManager.removeEventListener('peer:disconnect', onPeerDisconnect);
    };
  }, [handlePublicKeyMsgStream, libp2pNode, onPeerConnect, onPeerDisconnect, onPeerDiscovery]);

  const confirmArweaveTransaction = useCallback(
    async (peerId: string, arweaveTxId: string, unencryptedShardHash: string) => {
      try {
        // Get the connection of the archaeologist using the peerId
        const connection = archaeologists.find(arch => arch.profile.peerId === peerId)?.connection;

        if (!connection) throw new Error('No connection to archaeologist');

        const outboundMsg = JSON.stringify({
          arweaveTxId,
          unencryptedShardHash,
        });

        const { stream } = await connection.newStream('/arweave-signoff');

        pipe([new TextEncoder().encode(outboundMsg)], stream, async source => {
          for await (const data of source) {
            const dataStr = new TextDecoder().decode(data as BufferSource | undefined);
            console.log('dataStr', dataStr);
          }
        });
      } catch (err) {
        console.error(`Error in peer conn listener: ${err}`);
      }
    },
    [archaeologists]
  );

  const dialSelectedArchaeologists = useCallback(() => {
    selectedArchaeologists.map(async arch => {
      try {
        const connection = await libp2pNode?.dial(arch.fullPeerId!);
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(arch.profile.peerId, connection!));
      } catch (e) {
        console.log(`error connecting to ${arch.profile.peerId}`, e);
      }
    });
  }, [selectedArchaeologists, libp2pNode, dispatch]);

  return { confirmArweaveTransaction, dialSelectedArchaeologists };
}
