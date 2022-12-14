import { ethers } from 'ethers';
import { useSelector } from '../../../../../store';
import { useCallback, useContext } from 'react';
import { formatSubmitSarcophagusArgs } from '../../utils/formatSubmitSarcophagusArgs';
import { CreateSarcophagusContext } from '../../context/CreateSarcophagusContext';

export function useSubmitSarcophagus(embalmerFacet: ethers.Contract) {
  const { name, recipientState, resurrection, selectedArchaeologists, requiredArchaeologists } =
    useSelector(x => x.embalmState);

  const {
    negotiationTimestamp,
    archaeologistSignatures,
    archaeologistShards,
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
      archaeologistSignatures,
      arweaveTxId: sarcophagusPayloadTxId,
    });

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
    archaeologistSignatures,
    archaeologistShards,
    sarcophagusPayloadTxId,
    setSarcophagusTxId,
  ]);

  return {
    submitSarcophagus,
  };
}
