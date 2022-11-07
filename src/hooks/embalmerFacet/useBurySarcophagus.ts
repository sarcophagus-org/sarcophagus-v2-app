import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';
import { Abi } from 'abitype';

interface BurySarcophagusArgs {
  sarcoId: string;
}

export function useBurySarcophagus({ sarcoId }: BurySarcophagusArgs) {
  const toastDescription = 'Sarcophagus buried';
  const transactionDescription = 'Bury sarcophagus';

  const { submit } = useSubmitTransaction({
    abi: EmbalmerFacet__factory.abi as Abi,
    functionName: 'burySarcophagus',
    args: [sarcoId],
    toastDescription,
    transactionDescription,
    mode: 'prepared',
  });

  return { burySarcophagus: submit };
}
