import { ethers } from 'ethers';
import { EmbalmerFacet } from 'lib/abi/EmbalmerFacet';
import { SelectedContractArchaeologist } from 'types';
import { useSubmitTransaction } from '../useSubmitTransactions';
import { useCallback } from 'react';

// interface SarcophagusDetails {
//   name: string;
//   recipient: string;
//   resurrectionTime: number;
//   canBeTransferred: boolean;
//   minShards: number;
// }

interface CreateSarcophagusArgs {
  sarcoId: string;
  name: string;
  recipient: string;
  resurrectionTime: number;
  canBeTransferred: boolean;
  minShards: number;
  archaeologists: SelectedContractArchaeologist[];
  arweaveTxIds: string[];
}

export function useCreateSarcophagus() {
  const toastDescription = 'Sarcophagus created';
  const transactionDescription = 'Create sarcophagus';

  const submit = useCallback(
    ({
      sarcoId,
      name,
      recipient,
      resurrectionTime,
      canBeTransferred,
      minShards,
      archaeologists,
      arweaveTxIds,
    }: CreateSarcophagusArgs): void => {
      useSubmitTransaction({
        contractInterface: EmbalmerFacet.abi,
        functionName: 'createSarcophagus',
        args: [
          ethers.utils.formatBytes32String(sarcoId),
          {
            name,
            recipient,
            resurrectionTime,
            canBeTransferred,
            minShards,
          },
          archaeologists,
          arweaveTxIds,
        ],
        toastDescription,
        transactionDescription,
      });
    }
  );

  return { createSarcophagus: submit };
}
