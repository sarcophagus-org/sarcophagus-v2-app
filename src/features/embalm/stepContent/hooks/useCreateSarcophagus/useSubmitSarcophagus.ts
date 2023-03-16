import { ethers } from 'ethers';
import { useSelector } from '../../../../../store';
import { useCallback, useContext } from 'react';
import { formatSubmitSarcophagusArgs } from '../../utils/formatSubmitSarcophagusArgs';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { handleRpcError } from 'lib/utils/rpc-error-handler';
import * as Sentry from '@sentry/react';

export function useSubmitSarcophagus(embalmerFacet: ethers.Contract) {
  const { name, recipientState, resurrection, selectedArchaeologists, requiredArchaeologists, retryingCreate } =
    useSelector(x => x.embalmState);

  const {
    negotiationTimestamp,
    archaeologistPublicKeys,
    archaeologistSignatures,
    sarcophagusPayloadTxId,
    setSarcophagusTxId,
  } = useContext(CreateSarcophagusContext);

  const submitSarcophagus = useCallback(async () => {
    if (retryingCreate) {
      console.log('show modal, explain failure, validate bundlr bal againg re-upload cost, validate selected arch free-bonds against est. digging fee for sarco');
      // console.log('if validation fails, explain user will need to restart. show cancel sarco button');
      // console.log('if validations pass, show re-upload cost, show retry create sarco button, if clicked, continue from here');
      throw new Error('Retry!');
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
      await embalmerFacet.callStatic.createSarcophagus(...submitSarcophagusArgs);
    } catch (e) {
      const errorMsg = handleRpcError(e);
      Sentry.captureException(errorMsg, { fingerprint: ['CREATE_SARCOPHAGUS_FAILURE'] });
      throw new Error(errorMsg);
    }

    const tx = await embalmerFacet.createSarcophagus(...submitSarcophagusArgs);
    setSarcophagusTxId(tx.hash);
    await tx.wait();
  }, [
    embalmerFacet,
    name,
    recipientState,
    resurrection,
    selectedArchaeologists,
    requiredArchaeologists,
    negotiationTimestamp,
    archaeologistPublicKeys,
    archaeologistSignatures,
    sarcophagusPayloadTxId,
    setSarcophagusTxId,
    retryingCreate
  ]);

  return {
    submitSarcophagus,
  };
}
