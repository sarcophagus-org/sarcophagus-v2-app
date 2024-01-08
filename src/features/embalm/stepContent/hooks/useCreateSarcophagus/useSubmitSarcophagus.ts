import { useSelector } from '../../../../../store';
import { useCallback, useContext } from 'react';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { handleRpcError } from 'lib/utils/rpc-error-handler';
import * as Sentry from '@sentry/react';
import { sarco } from '@sarcophagus-org/sarcophagus-v2-sdk-client';

export function useSubmitSarcophagus() {
  const { name, recipientState, resurrection, selectedArchaeologists, requiredArchaeologists } =
    useSelector(x => x.embalmState);

  const {
    negotiationTimestamp,
    archaeologistPublicKeys,
    archaeologistSignatures,
    sarcophagusPayloadTxId,
    setSarcophagusTxId,
  } = useContext(CreateSarcophagusContext);

  const submitSarcophagus = useCallback(async () => {
    const { submitSarcophagusArgs } = sarco.utils.formatSubmitSarcophagusArgs({
      name,
      recipientState,
      resurrection,
      selectedArchaeologists,
      requiredArchaeologists,
      negotiationTimestamp,
      archaeologistPublicKeys,
      archaeologistSignatures,
      arweaveTxId: sarcophagusPayloadTxId,
    });

    try {
      const tx = await sarco.api.createSarcophagus(...submitSarcophagusArgs);
      setSarcophagusTxId(tx.hash);
      await tx.wait();
    } catch (e) {
      const errorMsg = handleRpcError(e);
      Sentry.captureException(errorMsg, { fingerprint: ['CREATE_SARCOPHAGUS_FAILURE'] });
      throw new Error(errorMsg);
    }
  }, [
    archaeologistPublicKeys,
    archaeologistSignatures,
    name,
    negotiationTimestamp,
    recipientState,
    requiredArchaeologists,
    resurrection,
    sarcophagusPayloadTxId,
    selectedArchaeologists,
    setSarcophagusTxId,
  ]);

  return {
    submitSarcophagus,
  };
}
