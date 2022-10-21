import { pipe } from 'it-pipe';
import React, { useCallback } from 'react';
import { setArchaeologistConnection, setArchaeologistException } from 'store/embalm/actions';
import { useDispatch, useSelector } from '../store';
import { NEGOTIATION_SIGNATURE_STREAM } from '../lib/config/node_config';
import { ArchaeologistEncryptedShard } from 'types';
import { useLibp2p } from './libp2p/useLibp2p';
import { BigNumber } from 'ethers';
import { getLowestRewrapInterval } from '../lib/utils/helpers';

interface SarcophagusNegotiationParams {
  arweaveTxId: string;
  unencryptedShardDoubleHash: string;
  maxRewrapInterval: BigNumber;
  diggingFee: string;
  timestamp: number;
}

export function useSarcophagusNegotiation() {
  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const { resetPublicKeyStream } = useLibp2p();
  const libp2pNode = useSelector(s => s.appState.libp2pNode);

  const dialSelectedArchaeologists = useCallback(async () => {
    await resetPublicKeyStream();

    for await (const arch of selectedArchaeologists) {
      try {
        const connection = await libp2pNode?.dial(arch.fullPeerId!);
        if (!connection) throw Error('No connection obtained from dial');
        dispatch(setArchaeologistConnection(arch.profile.peerId, connection));
      } catch (e) {
        console.error(`error connecting to ${arch.profile.peerId}`, e);
        dispatch(setArchaeologistException(arch.profile.peerId, { code: '', message: 'Could not establish a connection' }));
      }
    }
  }, [selectedArchaeologists, libp2pNode, dispatch, resetPublicKeyStream]);

  const initiateSarcophagusNegotiation = useCallback(
    async (
      archaeologistShards: ArchaeologistEncryptedShard[],
      encryptedShardsTxId: string,
      setArchaeologistSignatures: React.Dispatch<React.SetStateAction<Map<string, string>>>,
      setNegotiationTimestamp: React.Dispatch<React.SetStateAction<number>>
    ): Promise<void> => {
      try {
        const lowestRewrapInterval = getLowestRewrapInterval(selectedArchaeologists);

        const negotiationTimestamp = Date.now();
        setNegotiationTimestamp(negotiationTimestamp);

        const archaeologistSignatures = new Map<string, string>([]);

        await Promise.all(
          selectedArchaeologists.map(async arch => {
            if (!arch.connection)
              throw new Error(`No connection to archaeologist ${JSON.stringify(arch)}`);

            const negotiationParams: SarcophagusNegotiationParams = {
              arweaveTxId: encryptedShardsTxId,
              diggingFee: arch.profile.minimumDiggingFee.toString(),
              maxRewrapInterval: BigNumber.from(lowestRewrapInterval),
              timestamp: negotiationTimestamp,
              unencryptedShardDoubleHash: archaeologistShards.find(
                s => s.publicKey === arch.publicKey
              )!.unencryptedShardDoubleHash,
            };

            const outboundMsg = JSON.stringify(negotiationParams);

            const { stream } = await arch.connection.newStream(NEGOTIATION_SIGNATURE_STREAM);

            await pipe([new TextEncoder().encode(outboundMsg)], stream, async source => {
              for await (const data of source) {
                const dataStr = new TextDecoder().decode(data);
                // TODO: remove these logs after we gain some confidence in this exchange
                console.log('got', dataStr);

                const { signature }: { signature: string } = JSON.parse(dataStr);
                console.log('setting arch signature');
                console.log(signature);
                archaeologistSignatures.set(arch.profile.archAddress, signature);
              }
            }).finally(() => {
              stream.close();
            });
          })
        );

        setArchaeologistSignatures(archaeologistSignatures);
      } catch (err) {
        //TODO figure out what to do at this point
        console.error(`Error in initiateSarcophagusNegotiation: ${err}`);
      }
    },
    [selectedArchaeologists]
  );

  return {
    dialSelectedArchaeologists,
    initiateSarcophagusNegotiation,
  };
}
