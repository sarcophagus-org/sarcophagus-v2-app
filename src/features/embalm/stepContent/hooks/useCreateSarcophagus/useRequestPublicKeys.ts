import { pipe } from 'it-pipe';
import { PUBLIC_KEY_STREAM } from 'lib/config/node_config';
import { useDispatch } from 'store/index';
import { setArchaeologistException, setArchaeologistPublicKey } from 'store/embalm/actions';
import { Archaeologist, ArchaeologistExceptionCode } from 'types';
import { useCallback } from 'react';
import { ethers } from 'ethers';

interface PublicKeyResponseFromArchaeologist {
  signature: string;
  encryptionPublicKey: string;
}

export function useRequestPublicKeys() {
  const dispatch = useDispatch();

  const requestPublicKeys = useCallback(
    async (selectedArchaeologists: Archaeologist[]) => {
      const archPublicKeys: string[] = [];
      for await (const arch of selectedArchaeologists) {
        if (!arch.connection) {
          dispatch(
            setArchaeologistException(arch.profile.peerId, {
              code: ArchaeologistExceptionCode.CONNECTION_EXCEPTION,
              message: 'No connection to archaeologist',
            })
          );
          continue;
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

        try {
          const stream = await arch.connection.newStream(PUBLIC_KEY_STREAM);
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
                  continue;
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
          })
            .catch(handleException)
            .finally(() => stream.close());
        } catch (e) {
          handleException(e);
        }
      }

      return archPublicKeys;
    },
    [dispatch]
  );

  return {
    requestPublicKeys,
  };
}
