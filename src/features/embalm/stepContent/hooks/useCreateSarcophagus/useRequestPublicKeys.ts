import { pipe } from 'it-pipe';
import { PUBLIC_KEY_STREAM } from 'lib/config/node_config';
import { useDispatch, useSelector } from 'store/index';
import { setArchaeologistException, setArchaeologistPublicKey } from 'store/embalm/actions';
import { ArchaeologistExceptionCode } from 'types';
import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useDialArchaeologists } from './useDialArchaeologists';

interface PublicKeyResponseFromArchaeologist {
  signature: string;
  encryptionPublicKey: string;
}

// TODO -- remove this file
export function useRequestPublicKeys() {
  const dispatch = useDispatch();
  const { dialArchaeologist } = useDialArchaeologists();
  const { selectedArchaeologists } = useSelector(x => x.embalmState);

  const requestPublicKeys = useCallback(
    async (isRetry: boolean) => {
      const archPublicKeys: string[] = [];
      for await (const arch of selectedArchaeologists) {
        if (!arch.connection) {
          dispatch(
            setArchaeologistException(arch.profile.peerId, {
              code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
              message: 'No connection to archaeologist',
            })
          );

          if (isRetry && arch.fullPeerId) {
            arch.connection = await dialArchaeologist(arch.fullPeerId);
            if (!arch.connection) continue;
          } else {
            continue;
          }
        }

        const handleException = (e: any) => {
          // TODO: `message` will (likely) be user-facing. Need friendlier verbiage.
          const message = `Exception occurred in public key request stream for: ${arch.profile.archAddress}`;
          console.error(message, e);
          dispatch(
            setArchaeologistException(arch.profile.peerId, {
              code: ArchaeologistExceptionCode.STREAM_EXCEPTION,
              message,
            })
          );
        };

        const stream = await arch.connection.newStream(PUBLIC_KEY_STREAM);
        try {
          await pipe([new Uint8Array(0)], stream, async source => {
            for await (const data of source) {
              try {
                const decoded = new TextDecoder().decode(data.subarray());
                console.log(`received public key ${decoded}`);

                const publicKeyResponse: PublicKeyResponseFromArchaeologist = JSON.parse(decoded);
                const signerAddress = ethers.utils.verifyMessage(
                  publicKeyResponse.encryptionPublicKey,
                  publicKeyResponse.signature
                );

                if (signerAddress !== arch.profile.archAddress) {
                  const message = 'Signature does not match Archaeologist address';
                  console.error(message);
                  dispatch(
                    setArchaeologistException(arch.profile.peerId, {
                      code: ArchaeologistExceptionCode.STREAM_EXCEPTION,
                      message,
                    })
                  );
                  throw Error(message);
                }

                archPublicKeys.push(publicKeyResponse.encryptionPublicKey);
                dispatch(
                  setArchaeologistPublicKey(
                    arch.profile.peerId,
                    publicKeyResponse.encryptionPublicKey
                  )
                );
              } catch (e) {
                console.error(e);
                dispatch(
                  setArchaeologistException(arch.profile.peerId, {
                    code: ArchaeologistExceptionCode.STREAM_EXCEPTION,
                    message: 'Something went wrong during public key request',
                  })
                );
              }
            }
          });
        } catch (e: any) {
          handleException(e);
          throw Error(e || 'Something went wrong during public key request');
        } finally {
          stream.close();
        }
      }

      if (archPublicKeys.length < selectedArchaeologists.length) {
        console.log('received num of pub keys:', archPublicKeys.length);
        console.log('expected:', selectedArchaeologists.length);
        throw new Error('Not enough public keys');
      }
    },
    [dispatch, dialArchaeologist, selectedArchaeologists]
  );

  return {
    requestPublicKeys,
  };
}
