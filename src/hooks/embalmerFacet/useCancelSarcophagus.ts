import { EmbalmerFacet__factory } from '@sarcophagus-org/sarcophagus-v2-contracts';
import { useSubmitTransaction } from '../useSubmitTransaction';

interface CancelSarcophagusArgs {
  sarcoId: string;
}

export function useCancelSarcophagus({ sarcoId }: CancelSarcophagusArgs) {
  const toastDescription = 'Sarcophagus canceled';
  const transactionDescription = 'Cancel sarcophagus';

  const { submit } = useSubmitTransaction({
    contractInterface: EmbalmerFacet__factory.abi,
    functionName: 'cancelSarcophagus',
    args: [sarcoId],
    toastDescription,
    transactionDescription,
  });

  return { cancelSarcophagus: submit };
}
