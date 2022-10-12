import { Connection } from '@libp2p/interface-connection';
import { PeerInfo } from '@libp2p/interface-peer-info';
import { StreamHandler } from '@libp2p/interface-registrar';
import { ethers } from 'ethers';
import { pipe } from 'it-pipe';
import { useCallback, useEffect } from 'react';
import {
  setArchaeologistConnection,
  setArchaeologistFullPeerId,
  setArchaeologistOnlineStatus,
  setArchaeologistPublicKey,
  setArchaeologistSignature,
  setPublicKeysReady,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from 'store/index';
import { log } from '../../lib/utils/logger';
import { PUBLIC_KEY_STREAM, NEGOTIATION_SIGNATURE_STREAM } from '../../lib/config/node_config';
import { useCreateSarcophagus } from 'features/embalm/stepContent/hooks/useCreateSarcohpagus';
import { useCreateEncryptionKeypair } from 'features/embalm/stepContent/hooks/useCreateEncryptionKeypair';
import { ArchaeologistEncryptedShard } from 'types';

// values used to determine if an archaeologist is online
const pingThreshold = 60000;
const heartbeatTimeouts: Record<string, NodeJS.Timeout | undefined> = {};

interface PublicKeyResponseFromArchaeologist {
  signature: string;
  encryptionPublicKey: string;
}

interface SarcophagusNegotiationParams {
  arweaveTxId: string;
  unencryptedShardDoubleHash: string;
  maxRewrapInterval: number;
  diggingFee: string;
  timestamp: number;
}

export function useLibp2p() {
  const dispatch = useDispatch();
  const libp2pNode = useSelector(s => s.appState.libp2pNode);
  const {
    selectedArchaeologists,
    diggingFees,
    publicKeysReady,
  } = useSelector(s => s.embalmState);

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
        dispatch(setArchaeologistOnlineStatus(peerId.toString(), false));
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
        stream.close();
      });
    },
    [selectedArchaeologists, dispatch]
  );



  // TODO: Remove shard setup simulation code below when properly wired up
  const { uploadToArweave, isUploading } = useCreateSarcophagus();
  const { createEncryptionKeypair } = useCreateEncryptionKeypair();

  const initiateSarcophagusNegotiation = useCallback(
    async (archaeologistShards: ArchaeologistEncryptedShard[], encryptedShardsTxId: string) => {
      try {
        let maxRewrapInterval = selectedArchaeologists[0].profile.maximumRewrapInterval;
        selectedArchaeologists.forEach(arch => maxRewrapInterval = arch.profile.maximumRewrapInterval < maxRewrapInterval ? arch.profile.maximumRewrapInterval : maxRewrapInterval);

        if (archaeologistShards.length === 0) return;

        selectedArchaeologists.map(async arch => {
          if (!arch.connection) throw new Error(`No connection to archaeologist ${JSON.stringify(arch)}`);

          const negotiationParams: SarcophagusNegotiationParams = {
            arweaveTxId: encryptedShardsTxId,
            diggingFee: diggingFees,
            maxRewrapInterval,
            timestamp: Date.now(),
            unencryptedShardDoubleHash: archaeologistShards.filter(s => s.publicKey === arch.publicKey)[0].unencryptedShardDoubleHash,
          };

          console.log('negotiationParams', negotiationParams);

          const outboundMsg = JSON.stringify(negotiationParams);

          const { stream } = await arch.connection.newStream(NEGOTIATION_SIGNATURE_STREAM);

          pipe([new TextEncoder().encode(outboundMsg)], stream, async source => {
            for await (const data of source) {
              const dataStr = new TextDecoder().decode(data);
              console.log('got', dataStr);

              const { signature }: { signature: string } = JSON.parse(dataStr);
              console.log('set signature');
              console.log(signature);
              dispatch(setArchaeologistSignature(arch.profile.peerId, signature!));
            }
          }).finally(() => stream.close());
        });
      } catch (err) {
        //TODO figure out what to do at this point
        console.error(`Error in peer connection listener: ${err}`);
      }
    },
    [selectedArchaeologists, dispatch, diggingFees]
  );

  // Simulate private key sharding and upload to arweave
  useEffect(() => {
    (async () => {
      if (publicKeysReady) {
        await createEncryptionKeypair();
        const { encryptedShards, encryptedShardsTxId } = await uploadToArweave();

        console.log('initiating sarco negotiation');
        await initiateSarcophagusNegotiation(encryptedShards, encryptedShardsTxId);
        dispatch(setPublicKeysReady(false));
      }
    })();
  }, [publicKeysReady]);

  const resetPublicKeyStream = useCallback(async () => {
    await libp2pNode!.unhandle(PUBLIC_KEY_STREAM);

    await libp2pNode!.handle([PUBLIC_KEY_STREAM], handlePublicKeyStream);
  }, [handlePublicKeyStream, libp2pNode]);

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
  }, [selectedArchaeologists, libp2pNode, dispatch, resetPublicKeyStream]);

  return {
    onPeerDiscovery,
    onPeerConnect,
    onPeerDisconnect,
    handlePublicKeyStream,
    initiateSarcophagusNegotiation,
    dialSelectedArchaeologists,
  };
}
