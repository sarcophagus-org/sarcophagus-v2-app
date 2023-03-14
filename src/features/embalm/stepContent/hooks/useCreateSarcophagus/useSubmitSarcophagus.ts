import { ethers } from 'ethers';
import { useSelector } from '../../../../../store';
import { useCallback, useContext } from 'react';
import { formatSubmitSarcophagusArgs } from '../../utils/formatSubmitSarcophagusArgs';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';
import { handleRpcError } from 'lib/utils/rpc-error-handler';

export function useSubmitSarcophagus(embalmerFacet: ethers.Contract) {
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
  ]);

  return {
    submitSarcophagus,
  };
}
