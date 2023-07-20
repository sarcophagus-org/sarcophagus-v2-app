import { useCallback, useContext } from 'react';
import { useSelector } from '../../../../../store';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';
import * as Sentry from '@sentry/react';

export function useArchaeologistSignatureNegotiation() {
  const { selectedArchaeologists } = useSelector(s => s.embalmState);

  const { setArchaeologistPublicKeys, setArchaeologistSignatures, setNegotiationTimestamp } =
    useContext(CreateSarcophagusContext);

  const initiateSarcophagusNegotiation = useCallback(
    async (isRetry: boolean): Promise<void> => {
      const archaeologistSignatures = new Map<string, string>([]);
      const archaeologistPublicKeys = new Map<string, string>([]);

      try {
        const [negotiationResult, negotiationTimestamp] =
          await sarco.archaeologist.initiateSarcophagusNegotiation(selectedArchaeologists, isRetry);

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

        setNegotiationTimestamp(negotiationTimestamp);
        setArchaeologistPublicKeys(archaeologistPublicKeys);
        setArchaeologistSignatures(archaeologistSignatures);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    [
      selectedArchaeologists,
      setArchaeologistPublicKeys,
      setArchaeologistSignatures,
      setNegotiationTimestamp,
    ]
  );

  return {
    initiateSarcophagusNegotiation,
  };
}
