import { pipe } from 'it-pipe';
import React, { useCallback } from 'react';
import {
  setArchaeologistConnection,
  setArchaeologistException,
  setArchaeologistSignature,
} from 'store/embalm/actions';
import { useDispatch, useSelector } from '../store';
import { NEGOTIATION_SIGNATURE_STREAM } from '../lib/config/node_config';
import {
  ArchaeologistEncryptedShard,
  ArchaeologistExceptionCode,
  SarcophagusValidationError,
} from 'types';
import { useLibp2p } from './libp2p/useLibp2p';
import { getLowestRewrapInterval } from '../lib/utils/helpers';

interface SarcophagusNegotiationParams {
  arweaveTxId: string;
  unencryptedShardDoubleHash: string;
  maxRewrapInterval: number;
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
        dispatch(
          setArchaeologistException(arch.profile.peerId, {
            code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
            message: 'Could not establish a connection',
          })
        );
      }
    }
  }, [selectedArchaeologists, libp2pNode, dispatch, resetPublicKeyStream]);

  function processDeclinedSignatureCode(
    code: SarcophagusValidationError,
    archAddress: string
  ): string {
    // TODO: These messages will be user-facing. Better phrasing needed.
    switch (code) {
      case SarcophagusValidationError.DIGGING_FEE_TOO_LOW:
        return `Digging fee set for ${archAddress} is too low`;
      case SarcophagusValidationError.INVALID_ARWEAVE_SHARD:
        return `${archAddress} was assigned an invalid shard`;
      case SarcophagusValidationError.INVALID_TIMESTAMP:
        return `${archAddress} rejected negotiation time`;
      case SarcophagusValidationError.MAX_REWRAP_INTERVAL_TOO_LARGE:
        return `Rewrap interval set for ${archAddress} is too large`;
      case SarcophagusValidationError.UNKNOWN_ERROR:
        return `Exception while waiting for signature from ${archAddress}`;
    }
  }

  const initiateSarcophagusNegotiation = useCallback(
    async (
      archaeologistShards: ArchaeologistEncryptedShard[],
      encryptedShardsTxId: string,
      setArchaeologistSignatures: React.Dispatch<React.SetStateAction<Map<string, string>>>,
      setNegotiationTimestamp: React.Dispatch<React.SetStateAction<number>>
    ): Promise<void> => {
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
            maxRewrapInterval: lowestRewrapInterval,
            timestamp: negotiationTimestamp,
            unencryptedShardDoubleHash: archaeologistShards.find(
              s => s.publicKey === arch.publicKey
            )!.unencryptedShardDoubleHash,
          };

          const outboundMsg = JSON.stringify(negotiationParams);

          try {
            const stream = await arch.connection.newStream(NEGOTIATION_SIGNATURE_STREAM);

            await pipe([new TextEncoder().encode(outboundMsg)], stream, async source => {
              for await (const data of source) {
                const dataStr = new TextDecoder().decode(data.subarray());
                // TODO: remove these logs after we gain some confidence in this exchange
                console.log('got', dataStr);

                const response = JSON.parse(dataStr);
                if (response.error) {
                  dispatch(
                    setArchaeologistException(arch.profile.peerId, {
                      code: ArchaeologistExceptionCode.DECLINED_SIGNATURE,
                      message: processDeclinedSignatureCode(
                        response.error.code as SarcophagusValidationError,
                        arch.profile.archAddress
                      ),
                    })
                  );
                } else {
                  archaeologistSignatures.set(arch.profile.archAddress, response.signature);

                  dispatch(setArchaeologistSignature(arch.profile.peerId, response.signature));
                }
              }
            })
              .catch(e => {
                // TODO: `message` will (likely) be user-facing. Need friendlier verbiage.
                const message = `Exception occurred in negotiaton stream for: ${arch.profile.archAddress}`;
                console.error(`Stream exception on ${arch.profile.peerId}`, e);
                dispatch(
                  setArchaeologistException(arch.profile.peerId, {
                    code: ArchaeologistExceptionCode.STREAM_EXCEPTION,
                    message,
                  })
                );
              })
              .finally(() => stream.close());
          } catch (e) {
            // TODO: `message` will (likely) be user-facing. Need friendlier verbiage.
            const message = `Exception occurred attempting to open stream to: ${arch.profile.archAddress}`;
            console.error(`Stream exception on ${arch.profile.peerId}`, e);
            dispatch(
              setArchaeologistException(arch.profile.peerId, {
                code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
                message,
              })
            );
          }
        })
      );

      setArchaeologistSignatures(archaeologistSignatures);
    },
    [dispatch, selectedArchaeologists]
  );

  return {
    dialSelectedArchaeologists,
    initiateSarcophagusNegotiation,
  };
}
