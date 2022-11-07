import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';
import { Abi } from 'abitype';

interface CancelSarcophagusArgs {
  sarcoId: string;
}

export function useCancelSarcophagus({ sarcoId }: CancelSarcophagusArgs) {
  const toastDescription = 'Sarcophagus canceled';
  const transactionDescription = 'Cancel sarcophagus';

  const { submit } = useSubmitTransaction({
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'cancelSarcophagus',
    args: [sarcoId],
    toastDescription,
    transactionDescription,
    mode: 'prepared',
  });

  return { cancelSarcophagus: submit };
}
