import { useCallback, useContext } from 'react';
import { useSelector } from '../../../../../store';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { CancelCreateToken } from './useCreateSarcophagus';
import { sarco } from 'sarcophagus-v2-sdk';
import * as Sentry from '@sentry/react';

export function useArchaeologistSignatureNegotiation() {
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const { setArchaeologistPublicKeys, setArchaeologistSignatures } =
    useContext(CreateSarcophagusContext);

  const initiateSarcophagusNegotiation = useCallback(
    async (isRetry: boolean, cancelToken: CancelCreateToken): Promise<void> => {
      const archaeologistSignatures = new Map<string, string>([]);
      const archaeologistPublicKeys = new Map<string, string>([]);

      // if (cancelToken.cancelled) return;
      try {
        const negotiationResult = await sarco.archaeologist.initiateSarcophagusNegotiation(
          selectedArchaeologists,
          isRetry
        );

        selectedArchaeologists.forEach(arch => {
          const res = negotiationResult.get(arch.profile.peerId)!;
          if (res.exception) {
            console.log('arch exception:', arch.profile.archAddress, res.exception);
            Sentry.captureException(res.exception);
          } else {
            archaeologistPublicKeys.set(arch.profile.archAddress, res.publicKey!);
            archaeologistSignatures.set(arch.profile.archAddress, res.signature!);
          }
        });

        if (archaeologistPublicKeys.size !== selectedArchaeologists.length) {
          throw Error('Not enough public keys');
        }

        if (archaeologistSignatures.size !== selectedArchaeologists.length) {
          throw Error('Not enough signatures');
        }

        setArchaeologistPublicKeys(archaeologistPublicKeys);
        setArchaeologistSignatures(archaeologistSignatures);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    [selectedArchaeologists, setArchaeologistPublicKeys, setArchaeologistSignatures]
  );

  return {
    initiateSarcophagusNegotiation,
  };
}
