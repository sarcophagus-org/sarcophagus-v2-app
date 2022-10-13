import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';

interface BurySarcophagusArgs {
  sarcoId: string;
}

export function useBurySarcophagus({ sarcoId }: BurySarcophagusArgs) {
  const toastDescription = 'Sarcophagus buried';
  const transactionDescription = 'Bury sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet__factory.abi,
    functionName: 'burySarcophagus',
    args: [sarcoId],
    toastDescription,
    transactionDescription,
  });

  return { burySarcophagus: submit };
}
