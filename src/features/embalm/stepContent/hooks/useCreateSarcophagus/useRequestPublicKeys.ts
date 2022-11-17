import { pipe } from 'it-pipe';
import { PUBLIC_KEY_STREAM } from 'lib/config/node_config';
import { useDispatch } from 'store/index';
import { setArchaeologistException, setArchaeologistPublicKey } from 'store/embalm/actions';
import { Archaeologist, ArchaeologistExceptionCode } from 'types';
import { useCallback } from 'react';

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
        const stream = await arch.connection!.newStream(PUBLIC_KEY_STREAM);
        await pipe([new Uint8Array(0)], stream, async source => {
          for await (const data of source) {
            try {
              const decoded = new TextDecoder().decode(data.subarray());
              console.log(`received public key ${decoded}`);

              const publicKeyResponse: PublicKeyResponseFromArchaeologist = JSON.parse(decoded);
              archPublicKeys.push(publicKeyResponse.encryptionPublicKey);
              dispatch(
                setArchaeologistPublicKey(
                  arch.profile.peerId,
                  publicKeyResponse.encryptionPublicKey
                )
              );
            } catch (e) {
              console.error(e);
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
      }

      return archPublicKeys;
    },
    [dispatch]
  );

  return {
    requestPublicKeys,
  };
}
