import { EmbalmerFacet } from 'lib/abi/EmbalmerFacet';
import { useSubmitTransaction } from '../useSubmitTransactions';

interface BurySarcophagusArgs {
  sarcoId: string;
}

export function useBurySarcophagus({ sarcoId }: BurySarcophagusArgs) {
  const toastDescription = 'Sarcophagus buried';
  const transactionDescription = 'Bury sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet.abi,
    functionName: 'burySarcophagus',
    args: [sarcoId],
    toastDescription,
    transactionDescription,
  });

  return { burySarcophagus: submit };
}
