import { EmbalmerFacetABI } from '../../abis/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';

interface BurySarcophagusArgs {
  sarcoId: string;
}

export function useBurySarcophagus({ sarcoId }: BurySarcophagusArgs) {
  const toastDescription = 'Sarcophagus buried';
  const transactionDescription = 'Bury sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacetABI,
    functionName: 'burySarcophagus',
    args: [sarcoId],
    toastDescription,
    transactionDescription,
  });

  return { burySarcophagus: submit };
}
