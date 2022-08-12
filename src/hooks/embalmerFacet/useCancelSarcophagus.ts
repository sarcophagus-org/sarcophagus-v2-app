import { EmbalmerFacetABI } from '../../abis/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';

interface CancelSarcophagusArgs {
  sarcoId: string;
}

export function useCancelSarcophagus({ sarcoId }: CancelSarcophagusArgs) {
  const toastDescription = 'Sarcophagus canceled';
  const transactionDescription = 'Cancel sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacetABI,
    functionName: 'cancelSarcophagus',
    args: [sarcoId],
    toastDescription,
    transactionDescription,
  });

  return { cancelSarcophagus: submit };
}
