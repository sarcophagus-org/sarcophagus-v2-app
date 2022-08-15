import { EmbalmerFacetABI } from '../../abis/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';

// TODO: Remove any
interface FinalizeSarcophagusArgs {
  sarcoId: string;
  archeaologistSignatures: any[];
  arweaveArchaeologistSignature: any;
  arweaveTxId: string;
}

export function useFinalizeSarcophagus({
  sarcoId,
  archeaologistSignatures,
  arweaveArchaeologistSignature,
  arweaveTxId,
}: FinalizeSarcophagusArgs) {
  const toastDescription = 'Sarcophagus finalized';
  const transactionDescription = 'Finalize sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacetABI,
    functionName: 'finalizeSarcophagus',
    args: [sarcoId, archeaologistSignatures, arweaveArchaeologistSignature, arweaveTxId],
    toastDescription,
    transactionDescription,
  });

  return { finalizeSarcophagus: submit };
}
