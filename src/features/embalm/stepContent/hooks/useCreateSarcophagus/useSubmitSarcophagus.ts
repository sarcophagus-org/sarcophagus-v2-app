import { ethers } from 'ethers';
import { useSelector } from '../../../../../store';
import { useCallback, useContext } from 'react';
import { formatSubmitSarcophagusArgs } from '../../utils/formatSubmitSarcophagusArgs';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { handleRpcError } from 'lib/utils/rpc-error-handler';
import * as Sentry from '@sentry/react';
import { sarco } from 'sarcophagus-v2-sdk';

export function useSubmitSarcophagus(embalmerFacet: ethers.Contract) {
  const {
    name,
    recipientState,
    resurrection,
    selectedArchaeologists,
    requiredArchaeologists,
    retryingCreate,
  } = useSelector(x => x.embalmState);

  const {
    negotiationTimestamp,
    archaeologistPublicKeys,
    archaeologistSignatures,
    sarcophagusPayloadTxId,
    setSarcophagusTxId,
  } = useContext(CreateSarcophagusContext);

  const submitSarcophagus = useCallback(async () => {
    if (retryingCreate) {
      throw new Error('Retrying...');
    }

    const { submitSarcophagusArgs } = formatSubmitSarcophagusArgs({
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
    retryingCreate,
    sarcophagusPayloadTxId,
    selectedArchaeologists,
    setSarcophagusTxId,
  ]);

  return {
    submitSarcophagus,
  };
}
