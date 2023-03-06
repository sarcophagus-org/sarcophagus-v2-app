import { pipe } from 'it-pipe';
import { useCallback, useContext } from 'react';
import { setArchaeologistException } from 'store/embalm/actions';
import { useDispatch, useSelector } from '../../../../../store';
import { NEGOTIATION_SIGNATURE_STREAM } from '../../../../../lib/config/node_config';
import { ArchaeologistExceptionCode, SarcophagusValidationError } from 'types';
import {
  getLowestResurrectionTime,
  getLowestRewrapInterval,
} from '../../../../../lib/utils/helpers';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { useDialArchaeologists } from './useDialArchaeologists';
import { CancelCreateToken } from './useCreateSarcophagus';
import * as Sentry from '@sentry/react';

interface ArchaeologistSignatureNegotiationParams {
  maxRewrapInterval: number;
  maximumResurrectionTime: number;
  diggingFeePerSecond: string;
  timestamp: number;
}

interface ArchaeologistResponse {
  publicKey: string;
  signature: string;
  error?: any;
}

export function useArchaeologistSignatureNegotiation() {
  const dispatch = useDispatch();
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const { setArchaeologistPublicKeys, setArchaeologistSignatures, setNegotiationTimestamp } =
    useContext(CreateSarcophagusContext);

  const { dialArchaeologist } = useDialArchaeologists();

  function processDeclinedSignatureCode(
    code: SarcophagusValidationError,
    archAddress: string
  ): string {
    // TODO: These messages will be user-facing. Better phrasing needed.
    switch (code) {
      case SarcophagusValidationError.DIGGING_FEE_TOO_LOW:
        return `Digging fee set for ${archAddress} is too low`;
      case SarcophagusValidationError.INVALID_TIMESTAMP:
        return `${archAddress} rejected negotiation time`;
      case SarcophagusValidationError.MAX_REWRAP_INTERVAL_TOO_LARGE:
        return `Rewrap interval set for ${archAddress} is too large`;
      case SarcophagusValidationError.UNKNOWN_ERROR:
      default:
        return `Exception while waiting for signature from ${archAddress}`;
    }
  }

  const initiateSarcophagusNegotiation = useCallback(
    async (isRetry: boolean, cancelToken: CancelCreateToken): Promise<void> => {
      console.log('starting the negotiation');
      const lowestRewrapInterval = getLowestRewrapInterval(selectedArchaeologists);
      const lowestResurrectionTime = getLowestResurrectionTime(selectedArchaeologists);

      const negotiationTimestamp = Date.now();
      setNegotiationTimestamp(negotiationTimestamp);

      const archaeologistSignatures = new Map<string, string>([]);
      const archaeologistPublicKeys = new Map<string, string>([]);

      await Promise.all(
        selectedArchaeologists.map(async arch => {
          if (cancelToken.cancelled) return;

          if (!arch.connection) {
            console.log(`${arch.profile.peerId} connection is undefined`);
            setArchaeologistException(arch.profile.peerId, {
              code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
              message: 'No connection to archaeologist',
            });

            if (isRetry && arch.fullPeerId) {
              arch.connection = await dialArchaeologist(arch);
              if (!arch.connection) return;
            } else {
              return;
            }
          }

          const negotiationParams: ArchaeologistSignatureNegotiationParams = {
            diggingFeePerSecond: arch.profile.minimumDiggingFeePerSecond.toString(),
            maxRewrapInterval: lowestRewrapInterval,
            maximumResurrectionTime: lowestResurrectionTime,
            timestamp: negotiationTimestamp,
          };

          const outboundMsg = JSON.stringify(negotiationParams);

          try {
            const stream = await arch.connection.newStream(NEGOTIATION_SIGNATURE_STREAM);

            await pipe([new TextEncoder().encode(outboundMsg)], stream, async source => {
              for await (const data of source) {
                const dataStr = new TextDecoder().decode(data.subarray());
                const response: ArchaeologistResponse = JSON.parse(dataStr);

                // TODO: #multiple-key-update - verify signature in response using:
                // the signature from arch and all data in that sig
                // maxRewrapInterval, diggingFee, timestamp, publicKey

                if (response.error) {
                  Sentry.captureException(response);
                  console.log(`error response from arch: \n${response.error.message}`);
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
                  archaeologistPublicKeys.set(arch.profile.archAddress, response.publicKey);
                  archaeologistSignatures.set(arch.profile.archAddress, response.signature);
                }
              }
            })
              .catch(e => {
                // TODO: `message` will (likely) be user-facing. Need friendlier verbiage.
                const message = `Exception occurred in negotiation stream for: ${arch.profile.archAddress}`;
                console.error(`Stream exception on ${arch.profile.peerId}`, e);
                dispatch(
                  setArchaeologistException(arch.profile.peerId, {
                    code: ArchaeologistExceptionCode.STREAM_EXCEPTION,
                    message,
                  })
                );
                throw Error('stream exception');
              })
              .finally(() => stream.close());
          } catch (e) {
            throw Error(`stream exception: ${e}`);
          }
        })
      ).catch(error => {
        throw Error(`Error retrieving arch signatures ${error}`);
      });

      if (archaeologistPublicKeys.size !== selectedArchaeologists.length) {
        throw Error('Not enough public keys');
      }

      if (archaeologistSignatures.size !== selectedArchaeologists.length) {
        throw Error('Not enough signatures');
      }

      setArchaeologistPublicKeys(archaeologistPublicKeys);
      setArchaeologistSignatures(archaeologistSignatures);
    },
    [
      dispatch,
      selectedArchaeologists,
      dialArchaeologist,
      setArchaeologistPublicKeys,
      setArchaeologistSignatures,
      setNegotiationTimestamp,
    ]
  );

  return {
    initiateSarcophagusNegotiation,
  };
}
