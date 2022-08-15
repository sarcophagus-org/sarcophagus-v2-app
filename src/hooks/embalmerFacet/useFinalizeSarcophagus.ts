import { EmbalmerFacet } from '../../abi/EmbalmerFacet';
import { SignatureWithAccount } from '../../types';
import { useSubmitTransaction } from '../useSubmitTransactions';

interface FinalizeSarcophagusArgs {
  sarcoId: string;
  archeaologistSignatures: SignatureWithAccount[];
  arweaveArchaeologistSignature: SignatureWithAccount;
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
    contractInterface: EmbalmerFacet.abi,
    functionName: 'finalizeSarcophagus',
    args: [sarcoId, archeaologistSignatures, arweaveArchaeologistSignature, arweaveTxId],
    toastDescription,
    transactionDescription,
  });

  return { finalizeSarcophagus: submit };
}
