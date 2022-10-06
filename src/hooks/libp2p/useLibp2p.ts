import { Connection } from '@libp2p/interface-connection';
import { PeerInfo } from '@libp2p/interface-peer-info';
import { StreamHandler } from '@libp2p/interface-registrar';
import { ethers } from 'ethers';
import { pipe } from 'it-pipe';
import { useCallback } from 'react';
import {
  setArchaeologistConnection,
  setArchaeologistFullPeerId,
  setArchaeologistOnlineStatus,
  setArchaeologistPublicKey
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { log } from '../../lib/utils/logger';

// values used to determine if an archaeologist is online
const pingThreshold = 60000;
const heartbeatTimeouts: Record<string, NodeJS.Timeout | undefined> = {};

// stream protocol name used to receive archaeologist's public key
const PUBLIC_KEY_STREAM = '/public-key';

interface PublicKeyResponseFromArchaeologist {
  signature: string;
  encryptionPublicKey: string;
  peerId: string;
}

export function useLibp2p() {
  const dispatch = useDispatch();
  const libp2pNode = useSelector(s => s.appState.libp2pNode);
  const { archaeologists, selectedArchaeologists } = useSelector(s => s.embalmState);

  const onPeerDiscovery = useCallback(
    (evt: CustomEvent<PeerInfo>) => {
      const peerId = evt.detail.id;

      dispatch(setArchaeologistOnlineStatus(peerId.toString(), true));
      dispatch(setArchaeologistFullPeerId(peerId));

      if (heartbeatTimeouts[peerId.toString()]) {
        clearTimeout(heartbeatTimeouts[peerId.toString()]);
        heartbeatTimeouts[peerId.toString()] = undefined;
      }

      heartbeatTimeouts[peerId.toString()] = setTimeout(() => {
        console.log(`No longer online: ${peerId.toString()}`);
        dispatch(setArchaeologistOnlineStatus(
          peerId.toString(),
          false,
        ));
      }, pingThreshold);

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

  const handlePublicKeyStream: StreamHandler =
    ({ stream }) => {
      pipe(stream, async function (source) {
        for await (const msg of source) {
          try {
            const decoded = new TextDecoder().decode(msg);
            log(`received public key ${decoded}`);

            const publicKeyResponse: PublicKeyResponseFromArchaeologist = JSON.parse(decoded);

            const signerAddress = ethers.utils.verifyMessage(
              JSON.stringify({
                encryptionPublicKey: publicKeyResponse.encryptionPublicKey,
                peerId: publicKeyResponse.peerId,
              }),
              publicKeyResponse.signature
            );

            const arch = selectedArchaeologists.find(a => a.profile.archAddress === signerAddress);
            if (arch) {
              if (arch.profile.peerId !== arch.fullPeerId!.toString()) {
                // TODO -- handle error state here, will need to communicate to user
                console.error('arch peer ID does not match profile:', signerAddress);
              }
              dispatch(setArchaeologistPublicKey(arch.fullPeerId!.toString(), publicKeyResponse.encryptionPublicKey));
              setTimeout(() => {
                console.log('new arch', JSON.stringify(arch));
              }, 4000);
            } else {
              // TODO -- handle error state here, will need to communicate to user
              console.error('signature does not map to a selected archaeologist:', signerAddress);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }).finally(() => {
        // clean up resources
        stream.close();
      });
    };

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

  const resetPublicKeyStream = async () => {
    await libp2pNode!.unhandle(PUBLIC_KEY_STREAM);

    await libp2pNode!.handle(
      [PUBLIC_KEY_STREAM],
      handlePublicKeyStream
    );
  };

  const dialSelectedArchaeologists = useCallback(async () => {
    await resetPublicKeyStream();

    selectedArchaeologists.map(async arch => {
      try {
        const connection = await libp2pNode?.dial(arch.fullPeerId!);
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(arch.profile.peerId, connection!));
      } catch (e) {
        console.error(`error connecting to ${arch.profile.peerId}`, e);
      }
    });
  }, [selectedArchaeologists, libp2pNode, dispatch]);

  return {
    onPeerDiscovery,
    onPeerConnect,
    onPeerDisconnect,
    handlePublicKeyStream,
    confirmArweaveTransaction,
    dialSelectedArchaeologists
  };
}
