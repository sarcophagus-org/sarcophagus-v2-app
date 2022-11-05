import { ArchaeologistEncryptedShard } from '../../../../../types';
import { ethers } from 'ethers';
import { useSelector } from '../../../../../store';
import { useCallback } from 'react';
import { formatSubmitSarcophagusArgs } from '../../utils/formatSubmitSarcophagusArgs';

export function useSubmitSarcophagus(
  embalmerFacet: ethers.Contract,
  negotiationTimestamp: number,
  archaeologistSignatures: Map<string, string>,
  archaeologistShards: ArchaeologistEncryptedShard[],
  arweaveTxIds: string[]
) {
  const { name, recipientState, resurrection, selectedArchaeologists, requiredArchaeologists } =
    useSelector(x => x.embalmState);

  const submitSarcophagus = useCallback(async () => {
    const { submitSarcophagusArgs } = formatSubmitSarcophagusArgs({
      name,
      recipientState,
      resurrection,
      selectedArchaeologists,
      requiredArchaeologists,
      negotiationTimestamp,
      archaeologistSignatures,
      archaeologistShards,
      arweaveTxIds,
    });

    const tx = await embalmerFacet.createSarcophagus(...submitSarcophagusArgs);

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
    arweaveTxIds,
  ]);

  return {
    submitSarcophagus,
  };
}
