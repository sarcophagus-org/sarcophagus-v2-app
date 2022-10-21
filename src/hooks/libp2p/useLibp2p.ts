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
  setArchaeologistPublicKey,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { log } from '../../lib/utils/logger';
import { PUBLIC_KEY_STREAM } from '../../lib/config/node_config';

// values used to determine if an archaeologist is online
// const pingThreshold = 60000;
// const heartbeatTimeouts: Record<string, NodeJS.Timeout | undefined> = {};

interface PublicKeyResponseFromArchaeologist {
  signature: string;
  encryptionPublicKey: string;
}

export function useLibp2p() {
  const dispatch = useDispatch();
  const libp2pNode = useSelector(s => s.appState.libp2pNode);
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const onPeerDiscovery = useCallback(
    (evt: CustomEvent<PeerInfo>) => {
      const peerId = evt.detail.id;

      dispatch(setArchaeologistOnlineStatus(peerId.toString(), true));
      dispatch(setArchaeologistFullPeerId(peerId));

      // TODO: Uncomment this when we remove the timeout for discovery
      // if (heartbeatTimeouts[peerId.toString()]) {
      //   clearTimeout(heartbeatTimeouts[peerId.toString()]);
      //   heartbeatTimeouts[peerId.toString()] = undefined;
      // }

      // heartbeatTimeouts[peerId.toString()] = setTimeout(() => {
      //   console.log(`No longer online: ${peerId.toString()}`);
      //   dispatch(setArchaeologistOnlineStatus(peerId.toString(), false));
      // }, pingThreshold);
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

  const handlePublicKeyStream: StreamHandler = useCallback(
    ({ stream }) => {
      pipe(stream, async function (source) {
        for await (const msg of source) {
          try {
            const decoded = new TextDecoder().decode(msg);
            log(`received public key ${decoded}`);

            const publicKeyResponse: PublicKeyResponseFromArchaeologist = JSON.parse(decoded);

            const signerAddress = ethers.utils.verifyMessage(
              publicKeyResponse.encryptionPublicKey,
              publicKeyResponse.signature
            );

            const arch = selectedArchaeologists.find(a => a.profile.archAddress === signerAddress);
            if (arch) {
              if (arch.profile.peerId !== arch.fullPeerId!.toString()) {
                // TODO -- handle error state here, will need to communicate to user
                console.error('arch peer ID does not match profile:', signerAddress);
              }
              dispatch(
                setArchaeologistPublicKey(
                  arch.fullPeerId!.toString(),
                  publicKeyResponse.encryptionPublicKey
                )
              );
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
        console.log('closing the pub key stream');
        stream.close();
      });
    },
    [selectedArchaeologists, dispatch]
  );

  const resetPublicKeyStream = useCallback(async () => {
    await libp2pNode!.unhandle(PUBLIC_KEY_STREAM);
    await libp2pNode!.handle([PUBLIC_KEY_STREAM], handlePublicKeyStream);
  }, [handlePublicKeyStream, libp2pNode]);

  return {
    onPeerDiscovery,
    onPeerConnect,
    onPeerDisconnect,
    handlePublicKeyStream,
    resetPublicKeyStream,
  };
}
